package models

import (
	"github.com/jinzhu/gorm"
	u "unblog/utils"
)

type Rating struct {
	gorm.Model
	PostID   uint
	Username string
}

type RatingDTO struct {
	Title    string `json:"title"`
	Blogname string `json:"blogname"`
	Username string `json:"username"`
}

func countRating(blogname string, title string) int {
	count := 0
	post := GetPost(blogname, title)
	GetDB().Table("ratings").Where("post_id = ?", post.ID).Count(&count)
	return count
}

func alreadyRated(username string, blogname string, title string) *Rating {
	rating := &Rating{}
	post := GetPost(blogname, title)
	GetDB().Table("ratings").Where("post_id = ? and username = ?", post.ID, username).First(rating)
	return rating
}

func (rating *RatingDTO) GetRating() map[string]interface{} {

	resp := u.Message(true, "success")
	resp["rated"] = alreadyRated(rating.Username, rating.Blogname, rating.Title).Username == rating.Username
	resp["rating"] = countRating(rating.Blogname, rating.Title)
	return resp
}

func (rating *RatingDTO) Rate() map[string]interface{} {
	post := GetPost(rating.Blogname, rating.Title)
	if post == nil {
		return u.Message(false, "Post not found")
	}
	tmpRating := alreadyRated(rating.Username, rating.Blogname, rating.Title)

	if rating.Username == tmpRating.Username {
		GetDB().Unscoped().Delete(tmpRating)
	} else {
		tmpRating.PostID = post.ID
		tmpRating.Username = rating.Username
		GetDB().Create(tmpRating)
	}
	return rating.GetRating()
}
