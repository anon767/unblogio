package models

import (
	"github.com/jinzhu/gorm"
	"log"
	u "unblog/utils"
)

type File struct {
	gorm.Model
	Path     string `json:"path"`
	Name     string `json:"name"`
	Username string `json:"username"`
	MimeType string `json:"mimetype"`
}

func (file *File) Validate() (map[string]interface{}, bool) {


	if len(file.Username) < 2 {
		return u.Message(false, "Username is required and should have at least 2 characters"), false
	}

	if len(file.Name) < 2 {
		return u.Message(false, "Password is required and should have at least 2 characters"), false
	}


	return u.Message(false, "Requirement passed"), true
}

func (file *File) Create() map[string]interface{} {

	if resp, ok := file.Validate(); !ok {
		return resp
	}


	GetDB().Create(file)

	if file.ID <= 0 {
		return u.Message(false, "Failed to link file, connection error.")
	}

	log.Printf("File created: %s by %s", file.Name, file.Username)
	response := u.Message(true, "File has been linked")
	response["file"] = file
	return response
}
