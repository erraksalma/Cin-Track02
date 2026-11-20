import { getContents, getComments, addComment } from "./api.js";
import { creerCarte, creerModal } from "./render.js";
const moviesG = document.querySelector("#movies");
const modal = document.querySelector("#modal");
const modalContent = document.querySelector("#modalContent");
const closeModal = document.querySelector("#closeModal");
const recherche = document.querySelector("#recherche");
const status = document.querySelector("#status");
const pagination = document.querySelector("#pagination");
const favoritelist = document.querySelector("#favoritesList");
const commentsList = document.querySelector("#commentsList");
const commentForm = document.querySelector("#commentForm");
const authorInput = document.querySelector("#author");
const commentText = document.querySelector("#commentText");

let contenuSelectionne = null;

let movies = [];
let favoris = JSON.parse(localStorage.getItem("favoris")) || [];
let pageactuelle = 1;
let filmparpage = 6;

async function init() {
  try {
    movies = await getContents();
    afficherFilms();
    afficherFavoris();
    console.log(movies);
  } catch (error) {
    moviesG.innerHTML = `
    <p class="text-red-500 text-center">Impossible de charger les films et les series.
    Veuillez ressayer</p>
    `;
  }
}
init();
moviesG.addEventListener("click", (e) => {
  const btnFavori = e.target.closest("[data-favorite]");
  if (btnFavori) {
    e.stopPropagation();
    const id = btnFavori.dataset.favorite;
    if (favoris.includes(id)) {
      favoris = favoris.filter((f) => f !== id);
    } else {
      favoris.push(id);
    }
    localStorage.setItem("favoris", JSON.stringify(favoris));
    afficherFilms();
    afficherFavoris();
    return;
  }
  const card = e.target.closest("article");
  if (!card) return;
  const id = card.dataset.id;
  const film = movies.find((movie) => movie.id == id);
  if (film) {
    contenuSelectionne = film;

    modalContent.innerHTML = creerModal(film);

    modal.classList.remove("hidden");
    modal.classList.add("flex");

    afficherCommentaires(film);
  }
});
closeModal.addEventListener("click", () => {
  modal.classList.add("hidden");
  modal.classList.remove("flex");
});

async function afficherCommentaires(item) {
  commentsList.innerHTML = `
    <p class="text-gray-400 text-center">
            Chargement des commentaires...
        </p>
    
    `;
  try {
    const all = await getComments();
    const comments = all.filter((comment) => {
      return String(comment.contentId) === String(item.id);
    });

    if (comments.length === 0) {
      commentsList.innerHTML = `
                <p class="text-gray-400 text-center">
                    Aucun commentaire
                </p>
            `;
      return;
    }

    commentsList.innerHTML = "";

    comments.forEach((comment) => {
      commentsList.innerHTML += `
                <div class="bg-[#171717] p-4 rounded-lg border border-gray-700">

                    <p class="font-bold text-[#B03050]">
                        ${comment.author}
                    </p>

                    <p class="text-gray-400 text-xs mt-1">
                        ${new Date(comment.createdAt).toLocaleDateString("fr-FR")}
                    </p>

                    <p class="text-white mt-2">
                        ${comment.text}
                    </p>

                </div>
            `;
    });
  } catch (error) {
    commentsList.innerHTML = `
            <p class="text-gray-400 text-center">
                Aucun commentaire
            </p>
        `;
  }
}

async function ajouterCommentaire(e) {
  e.preventDefault();

  const author = authorInput.value.trim();
  const text = commentText.value.trim();

  if (!author || !text) {
    return;
  }

  const data = {
    contentId: contenuSelectionne.id,
    author: author,
    text: text,
    createdAt: new Date().toISOString(),
  };

  try {
    await addComment(data);

    commentForm.reset();

    await afficherCommentaires(contenuSelectionne);
  } catch (error) {
    console.log("Erreur ajout commentaire", error);
  }
}
commentForm.addEventListener("submit", ajouterCommentaire);
function afficherFilms() {
  // recherche
  const texte = recherche.value.toLowerCase().trim();
  let resultats = movies.filter((film) => {
    return film.title.toLowerCase().startsWith(texte);
  });
  //  Filtrage
  const categorie = status.value;
  resultats = resultats.filter((film) => {
    if (categorie === "all") {
      return true;
    }
    return film.type === categorie;
  });
  //  calcule des pages
  const totalpages = Math.ceil(resultats.length / filmparpage);
  if (pageactuelle > totalpages) {
    pageactuelle = 1;
  }
  //  decoupage des films l pagination
  const debut = (pageactuelle - 1) * filmparpage;
  const fin = debut + filmparpage;
  const filmspage = resultats.slice(debut, fin);
  //  affichage
  if (filmspage.length === 0) {
    moviesG.innerHTML = `
            <p>Aucun film ou série trouvé</p>
        `;
  } else {
    moviesG.innerHTML = filmspage
      .map((film) => {
        return creerCarte(film);
      })
      .join("");
  }
  // boutons
  afficherPagination(totalpages);
}
function afficherPagination(totalpages) {
  pagination.innerHTML = "";

  for (let i = 1; i <= totalpages; i++) {
    pagination.innerHTML += `
            <button
                data-page="${i}"
                class="px-4 py-2 rounded-lg ${
                  pageactuelle === i
                    ? "bg-[#800020] text-white"
                    : "bg-white text-red-900"
                }">
                ${i}
            </button>
        `;
  }
}
// recherche
recherche.addEventListener("input", () => {
  pageactuelle = 1;
  afficherFilms();
});
// filtrage
status.addEventListener("change", () => {
  pageactuelle = 1;
  afficherFilms();
});
// pagination
pagination.addEventListener("click", (e) => {
  const bouton = e.target.closest("button");
  if (!bouton) return;
  pageactuelle = Number(bouton.dataset.page);
  afficherFilms();
});

function afficherFavoris() {
  const filmsfavoris = movies.filter((film) => {
    return favoris.includes(String(film.id));
  });

  if (filmsfavoris.length === 0) {
    favoritelist.innerHTML = `
            <p class="text-gray-400 text-center">
                Aucun favori pour le moment ❤️
            </p>
        `;
    return;
  }

  favoritelist.innerHTML = filmsfavoris
    .map((film) => {
      return `
            <div class="flex items-center justify-between gap-2">
                <p class="text-white">${film.title}</p>
                <button data-remove="${film.id}">
                    ❌
                </button>
            </div>
        `;
    })
    .join("");
}
favoritelist.addEventListener("click", (e) => {
  const bouton = e.target.closest("[data-remove]");
  if (!bouton) return;
  const id = bouton.dataset.remove;
  favoris = favoris.filter((f) => f !== id);
  localStorage.setItem("favoris", JSON.stringify(favoris));
  afficherFilms();
  afficherFavoris();
});
