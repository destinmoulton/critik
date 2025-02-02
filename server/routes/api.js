const fsp = require('fs').promises
const path = require('path');

const express = require('express');
const router = express.Router(); // Use Express Router for better organization

// Example 1: GET request to fetch all items
router.get('/files', async (req, res) => {
  let show_hidden = false;
  if(req.query.hasOwnProperty('show_hidden') && req.query.show_hidden==="true"){
    show_hidden = true;
  }

  // In a real application, you would fetch data from a database or other source
  let base_path = "/home/destin";
  let files = await fsp.readdir(base_path, {withFileTypes: true});
  console.log(req.query);
  let file_results = [];
  let dir_results = [];
  for (let file of files) {
    let fullPath = path.join(base_path, file.name);
    if(file.name =="."||file.name =="..") continue; // ignore the directory pointers

    if(!show_hidden && file.name.startsWith(".")) continue; // don't show hidden

    let res = file;

    res.is_directory = false;
    res.fullPath = fullPath;

    if(file.isSymbolicLink()){
      // TODO: Figure out how to handle symlinks, because I use them a lot
      console.log("symlink", await fsp.readlink(fullPath));
    }
    if(file.isDirectory()){
      res.is_directory = true;
      dir_results.push(res);
    } else {
      file_results.push(res);
    }
  }
  dir_results.sort((a,b) => a.name.localeCompare(b.name));
  file_results.sort((a,b) => a.name.localeCompare(b.name));
  res.json(dir_results.concat(file_results));
});

module.exports = router;