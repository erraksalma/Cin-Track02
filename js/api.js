
const api = "https://6afaf1f8730c1d152f32d0e1.mockapi.io/api/v1/contents";

export async function getMovies() {
    try {
        const reponse = await fetch(api);
        if (!reponse.ok) {
            throw new Error("Erreur lors du téléchargement des données");
        }
        const data = await reponse.json();
        return data;
    } catch (error) {
        console.log("Erreur :", error);
        throw error;
    }
}
