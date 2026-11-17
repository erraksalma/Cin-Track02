import { getContents, getComments } from "./api.js";
const adminContent= document.querySelector("#adminContents");
async function afficherContenus() {
    try{
        const contents=await getContents();
        // console.log(contents);
        adminContent.innerHTML="";
        contents.forEach(content => {
            adminContent.innerHTML += `
    <div class="bg-gray-800 p-5 rounded-xl shadow-lg
                flex justify-between items-center
                text-white mb-4">
        <div>
            <h3 class="text-xl font-bold">${content.title}</h3>
            <p class="text-gray-400">${content.type}</p>
        </div>
    </div>
`;  
        });
    }catch(error){
    console.log("erreur du telechargement", error);
    }
} afficherContenus();

