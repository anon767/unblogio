package main

import (
	"fmt"
	"github.com/gorilla/mux"
	"github.com/rs/cors"
	"net/http"
	"unblog/app"
	"unblog/controllers"
	"unblog/models"
)

func main() {
	router := mux.NewRouter()
	authrouter := router.PathPrefix("/protected").Subrouter()

	router.HandleFunc("/api/user", controllers.CreateAccount).Methods("POST")
	router.HandleFunc("/api/user/login", controllers.Authenticate).Methods("POST")
	router.HandleFunc("/api/user/{id}/posts", controllers.GetPosts).Methods("GET")
	router.HandleFunc("/api/user/{uid}/posts/{title}", controllers.GetPost).Methods("GET")
	router.HandleFunc("/api/posts/search/{searchTerm}", controllers.SearchPosts).Methods("GET")
	router.HandleFunc("/api/posts/search/", controllers.GetAllPosts).Methods("GET")
	router.HandleFunc("/api/posts/new/", controllers.GetAllNewPosts).Methods("GET")
	router.HandleFunc("/api/files/{id}", controllers.ServeFile).Methods("GET")
	router.HandleFunc("/api/rating/{uid}/posts/{title}", controllers.GetRating).Methods("GET")
	router.HandleFunc("/api/comment/{uid}/posts/{title}", controllers.GetAllComments).Methods("GET")
	router.HandleFunc("/api/user/{id}/follow", controllers.GetFollower).Methods("GET")

	authrouter.HandleFunc("/api/posts", controllers.CreatePost).Methods("POST")
	authrouter.HandleFunc("/api/user/{uid}/posts/{title}", controllers.UpdatePost).Methods("PUT")
	authrouter.HandleFunc("/api/files", controllers.UploadFile).Methods("POST")
	authrouter.HandleFunc("/api/rating", controllers.Rate).Methods("POST")
	authrouter.HandleFunc("/api/rating/{uid}/posts/{title}", controllers.GetRatingPersonal).Methods("GET")
	authrouter.HandleFunc("/api/comment", controllers.Comment).Methods("POST")
	authrouter.HandleFunc("/api/comment/{id}/like", controllers.Like).Methods("PUT")
	authrouter.HandleFunc("/api/user/{id}/follow", controllers.Follow).Methods("PUT")
	authrouter.HandleFunc("/api/user/{id}/follow", controllers.GetFollowerPersonal).Methods("GET")
	authrouter.HandleFunc("/api/feed", controllers.GetFeed).Methods("GET")

	authrouter.Use(app.JwtAuthentication) //attach JWT auth middleware

	//router.NotFoundHandler = app.NotFoundHandler

	port := models.GetConfig().Port
	if port == "" {
		port = "8000" //localhost
	}

	fmt.Println(port)
	c := cors.New(cors.Options{
		AllowedOrigins:   []string{"*"},
		AllowedHeaders:   []string{"*"},
		AllowedMethods:   []string{"GET", "POST", "DELETE", "PUT", "OPTIONS"},
		AllowCredentials: true,
	})

	handler := c.Handler(router)

	err := http.ListenAndServe(":"+port, handler)
	if err != nil {
		fmt.Print(err)
	}
}
