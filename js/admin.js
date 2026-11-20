import {
  getContents,
  deleteContent,
  createContent,
  updateContent,
} from "./api.js";
const adminContent = document.querySelector("#adminContents");
const contentForm = document.querySelector("#contentForm");
const submitBtn = document.querySelector("#submitBtn");
const typeInput = document.querySelector("#type");

const durationContainer = document.querySelector("#durationContainer");
const durationInput = document.querySelector("#duration");

const seasonsContainer = document.querySelector("#seasonsContainer");
const seasonsInput = document.querySelector("#seasons");
let editId = null;
async function afficherContenus() {
  try {
    const contents = await getContents();
    // console.log(contents);
    adminContent.innerHTML = "";
    contents.forEach((content) => {
      adminContent.innerHTML += `
    <tr class="border-b border-gray-700">
                    <td class="p-4">
                        <img src="${content.image}"
                             class="w-16 h-20 object-cover rounded">
    </td>
    <td class="p-4">${content.title}</td>
    <td class="p-4">${content.type}</td>
    <td class="p-4">${content.releaseYear}</td>
    <td class="p-4 flex gap-2">
                    <button data-id="${content.id}"
                            class=" modifier bg-[#dca734] hover:bg-[#c7770f] text-white p-3 rounded-lg font-bold transition">
                            Modifier
                        </button>
                        <button data-id="${content.id}"
                            class=" supprimer bg-[#B03050] hover:bg-[#8B1E3F] text-white p-3 rounded-lg font-bold transition">
                            Supprimer
                        </button>
                    </td>
                </tr>
`;
    });
  } catch (error) {
    console.log("erreur affichagee", error);
  }
}
contentForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const data = {
    title: document.querySelector("#title").value,
    type: document.querySelector("#type").value,
    releaseYear: Number(document.querySelector("#releaseYear").value),
    image: document.querySelector("#image").value,

    duration: typeInput.value === "movie" ? Number(durationInput.value) : null,

    seasons:
      typeInput.value === "series"
        ? Array.from({ length: Number(seasonsInput.value) }, (_, i) => i + 1)
        : null,

    genres: document
      .querySelector("#genres")
      .value.split(",")
      .map((g) => g.trim()),

    description: document.querySelector("#description").value,

    directors: document
      .querySelector("#directors")
      .value.split(",")
      .map((d) => d.trim()),

    productionCountries: document
      .querySelector("#productionCountries")
      .value.split(",")
      .map((p) => p.trim()),
  };

  try {
    if (editId === null) {
      await createContent(data);
      alert("Contenu ajouté avec succès");
    } else {
      await updateContent(editId, data);
      alert("Contenu modifié avec succès");
      editId = null;
      submitBtn.textContent = "Ajouter";
    }
    contentForm.reset();
    durationContainer.classList.remove("hidden");
    seasonsContainer.classList.add("hidden");
    durationInput.required = true;
    seasonsInput.required = false;
    await afficherContenus();
  } catch (error) {
    console.log("Erreur ajout/modification", error);
  }
});

typeInput.addEventListener("change", () => {
  if (typeInput.value === "movie") {
    durationContainer.classList.remove("hidden");
    seasonsContainer.classList.add("hidden");
    durationInput.required = true;
    seasonsInput.required = false;
    seasonsInput.value = "";
  } else if (typeInput.value === "series") {
    durationContainer.classList.add("hidden");
    seasonsContainer.classList.remove("hidden");

    durationInput.required = false;
    seasonsInput.required = true;

    durationInput.value = "";
  }
});
adminContent.addEventListener("click", async (e) => {
  const button = e.target.closest("button");

  if (!button) return;

  const id = button.dataset.id;

  // suprimerr
  if (button.classList.contains("supprimer")) {
    const confirmation = confirm("Voulez-vous supprimer ce contenu ?");

    if (confirmation) {
      try {
        await deleteContent(id);
        await afficherContenus();

        alert("Contenu supprimé avec succès");
      } catch (error) {
        console.log("Erreur de suppression", error);
      }
    }
  }

  // edit
  if (button.classList.contains("modifier")) {
    try {
      const contents = await getContents();
      const content = contents.find((i) => i.id == id);
      console.log(content);
      console.log("Seasons :", content.seasons);
      console.log("Type :", content.type);
      if (!content) return;
      typeInput.value = content.type;

      if (content.type === "movie") {
        durationContainer.classList.remove("hidden");
        seasonsContainer.classList.add("hidden");

        durationInput.value = content.duration || "";
      } else {
        durationContainer.classList.add("hidden");
        seasonsContainer.classList.remove("hidden");

        seasonsInput.value = content.seasons.length;
      }
      document.querySelector("#title").value = content.title;
      document.querySelector("#type").value = content.type;
      document.querySelector("#releaseYear").value = content.releaseYear;
      document.querySelector("#image").value = content.image;
      document.querySelector("#genres").value = content.genres.join(", ");
      document.querySelector("#description").value = content.description;
      document.querySelector("#directors").value = content.directors.join(", ");
      document.querySelector("#productionCountries").value =
        content.productionCountries.join(", ");

      editId = id;

      submitBtn.textContent = "Enregistrer les modifications";

      contentForm.scrollIntoView({
        behavior: "smooth",
      });
    } catch (error) {
      console.log("Erreur modification", error);
    }
  }
});
afficherContenus();
