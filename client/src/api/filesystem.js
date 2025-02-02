export default{
  async getFiles(){
    console.log('getFiles()');
    const options={show_hidden:false};
    const url = new URL(window.location.origin+"/api/files");
    url.search = new URLSearchParams(options);
    return await fetch(url)
      .then(res=>res.json());
  }
}
