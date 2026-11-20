const api = "https://6afaf1f8730c1d152f32d0e1.mockapi.io/api/v1";
export async function request(url, options ={}) {
    try{
        const reponse = await fetch(api + url, {
            headers: {
                "Content-Type": "application/json"
            },
            ...options
        });
        if (!reponse.ok){
            throw new Error("Erreur lors de la requete");
        }
        const data=await reponse.json();
        return data;
    } catch(error){
        console.log("Erreur",error);
        throw error;
    }
}
export async function getContents() {
    return await request("/contents");
}
 export async function createContent(data) {
    return await request ("/contents", {
        method: "POST",
        body: JSON.stringify(data)
    });
    
 }

 export async function updateContent(id, data){
    return await request("/contents/" + id,{
        method: "PUT",
        body: JSON.stringify(data)
    });
 }

 export async function deleteContent(id) {
    return await request("/contents/" + id,{
        method: "DELETE"
    });
    
 }

  export async function getComments() {
    return await request("/comments");
}