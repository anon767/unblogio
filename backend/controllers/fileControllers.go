package controllers

import (
	"github.com/gorilla/mux"
	"io/ioutil"
	"net/http"
	"os"
	"strings"
	"unblog/models"
	u "unblog/utils"
)

var UploadFile = func(w http.ResponseWriter, r *http.Request) {
	r.ParseMultipartForm(10 << 20)
	file, handler, err := r.FormFile("file")
	if err != nil {
		u.Respond(w, u.Message(false, "Couldn't save file  "+err.Error()))
		return
	}
	defer file.Close()

	suffix := strings.ToLower(strings.Split(handler.Filename, ".")[1])
	if suffix != "png" && suffix != "jpg" {
		u.Respond(w, u.Message(false, "Currently only PNG or JPGs are allowed"))
		return
	}

	savePath := u.RandStringBytesMaskImpr(16) + "." + suffix

	f, err := os.OpenFile(models.GetConfig().DataFolder+savePath, os.O_WRONLY|os.O_CREATE, 0666)
	if err != nil {
		u.Respond(w, u.Message(false, "Couldn't save file "+err.Error()))
		return
	}
	defer f.Close()

	fileBytes, err := ioutil.ReadAll(file)
	if err != nil {
		u.Respond(w, u.Message(false, "Couldn't save file "+err.Error()))
		return
	}
	f.Write(fileBytes)

	user := r.Context().Value("user").(uint)
	File := &models.File{}
	File.Username = models.GetUser(user).Username
	File.Name = handler.Filename
	File.MimeType = suffix
	File.Path = savePath

	u.Respond(w, File.Create())
}

var ServeFile = func(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "image/jpeg")
	vars := mux.Vars(r)
	path := vars["id"]
	if strings.HasPrefix(path, "..") {
		u.Respond(w, u.Message(false, "Illegal request"))
		return
	}
	var url = models.GetConfig().DataFolder + path
	http.ServeFile(w, r, url)
}
