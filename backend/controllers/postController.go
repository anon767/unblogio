package controllers

import (
	"encoding/json"
	"github.com/gorilla/mux"
	"log"
	"net/http"
	"unblog/models"
	u "unblog/utils"
)

var CreatePost = func(w http.ResponseWriter, r *http.Request) {
	user := r.Context().Value("user").(uint) //Grab the id of the user that send the request
	post := &models.Post{}

	err := json.NewDecoder(r.Body).Decode(post)
	if err != nil {
		u.Respond(w, u.Message(false, "Error while decoding request body"))
		return
	}
	log.Printf("Post created: %s", post.Title)
	post.Username = models.GetUser(user).Username
	resp := post.Create()
	u.Respond(w, resp)
}

var GetPosts = func(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	username := vars["id"]
	data := models.GetPosts(username)
	resp := u.Message(true, "success")
	resp["data"] = data
	u.Respond(w, resp)
}

var GetPost = func(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	username := vars["uid"]
	postTitle := vars["title"]
	post := models.GetPost(username, postTitle)
	post.Views = post.Views + 1
	post.Update()
	resp := u.Message(true, "success")
	resp["data"] = post
	u.Respond(w, resp)
}

var UpdatePost = func(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	username := vars["uid"]

	newPost := &models.Post{}
	newPost.Username = username
	err := json.NewDecoder(r.Body).Decode(newPost)
	if err != nil {
		u.Respond(w, u.Message(false, "Error while decoding request body"))
		return
	}
	oldPost := models.GetPostByID(newPost.ID)
	if oldPost == nil {
		u.Respond(w, u.Message(false, "Post not found"))
		return
	}
	user := r.Context().Value("user").(uint) //Grab the id of the user that send the request
	if models.GetUser(user).Username != oldPost.Username {
		u.Respond(w, u.Message(false, "You can only edit your own Posts"))
		return
	}

	oldPost.Body = newPost.Body
	oldPost.Title = newPost.Title
	oldPost.Image = newPost.Image
	resp := oldPost.Update()

	u.Respond(w, resp)
}

var SearchPosts = func(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	searchTerm := vars["searchTerm"]
	data := models.SearchPosts(searchTerm)
	resp := u.Message(true, "success")
	resp["data"] = data
	u.Respond(w, resp)
}

var GetAllPosts = func(w http.ResponseWriter, r *http.Request) {
	data := models.GetAllPosts()
	resp := u.Message(true, "success")
	resp["data"] = data
	u.Respond(w, resp)
}

var GetAllNewPosts = func(w http.ResponseWriter, r *http.Request) {
	data := models.GetAllNewPosts()
	resp := u.Message(true, "success")
	resp["data"] = data
	u.Respond(w, resp)
}

var GetFeed = func(w http.ResponseWriter, r *http.Request) {
	username := models.GetUser(r.Context().Value("user").(uint)).Username
	data := models.GetFeed(username)
	resp := u.Message(true, "success")
	resp["data"] = data
	u.Respond(w, resp)
}