package models

import (
	"fmt"
	"github.com/jinzhu/gorm"
	"github.com/microcosm-cc/bluemonday"
	u "unblog/utils"
)

type Post struct {
	gorm.Model
	Title    string `json:"title"`
	Body     string `json:"body"`
	Image    string `json:"image"`
	Username string `json:"username"` //The user that this contact belongs to
	Views    uint   `json:"views"`
}

/*
 This struct function validate the required parameters sent through the http request body
returns message and true if the requirement is met
*/
func (post *Post) Validate() (map[string]interface{}, bool) {
	p := bluemonday.UGCPolicy()
	p.AllowImages()
	p.AllowDataURIImages()

	if post.Title == "" {
		return u.Message(false, "Post title should be on the payload"), false
	}

	if len(post.Title) > 20 {
		return u.Message(false, "Post title should have a maximum of 20 characters"), false
	}

	if post.Body == "" {
		return u.Message(false, "Body number should be on the payload"), false
	}
	post.Body = p.Sanitize(post.Body)
	if len(post.Username) <= 1 {
		return u.Message(false, "User is not recognized"), false
	}

	//All the required parameters are present
	return u.Message(true, "success"), true
}

func (post *Post) Create() map[string]interface{} {
	if resp, ok := post.Validate(); !ok {
		return resp
	}

	tempPost := GetPost(post.Username, post.Title)
	if tempPost != nil {
		return u.Message(false, "You already have a post with the same title!")
	}
	post.Views = 0
	GetDB().Create(post)

	resp := u.Message(true, "success")
	resp["post"] = post
	return resp
}

func (post *Post) Update() map[string]interface{} {
	if resp, ok := post.Validate(); !ok {
		return resp
	}
	GetDB().Save(post)

	resp := u.Message(true, "success")
	resp["post"] = post
	return resp
}

func GetPosts(user string) []*Post {

	posts := make([]*Post, 0)
	err := GetDB().Table("posts").Where("username = ?", user).Order("created_at DESC").Find(&posts).Error
	if err != nil {
		fmt.Println(err)
		return nil
	}

	return posts
}

func GetAllPosts() []*Post {

	posts := make([]*Post, 0)
	err := GetDB().Table("posts").Order("views DESC").Find(&posts).Error
	if err != nil {
		fmt.Println(err)
		return nil
	}
	return posts
}
func GetAllNewPosts() []*Post {
	posts := make([]*Post, 0)
	err := GetDB().Table("posts").Order("created_at DESC").Find(&posts).Error
	if err != nil {
		fmt.Println(err)
		return nil
	}
	return posts
}
func GetPostByID(id uint) *Post {
	post := &Post{}
	err := GetDB().Table("posts").Where("id = ?", id).Limit(1).Find(&post).Error
	if err != nil {
		fmt.Println(err)
		return nil
	}
	return post
}

func GetPost(user string, title string) *Post {
	post := &Post{}
	err := GetDB().Table("posts").Where("username = ? and title = ?", user, title).Limit(1).Find(&post).Error
	if err != nil {
		fmt.Println(err)
		return nil
	}
	return post
}

func SearchPosts(searchTerm string) []*Post {
	posts := make([]*Post, 0)
	err := GetDB().Table("posts").Where("username LIKE ? or title LIKE ? or body LIKE ?", "%"+searchTerm+"%", "%"+searchTerm+"%", "%"+searchTerm+"%").Order("views DESC").Find(&posts).Error
	if err != nil {
		fmt.Println(err)
		return nil
	}
	return posts
}

func GetFeed(username string) []*Post {
	posts := make([]*Post, 0)
	err := db.Table("posts").Joins("inner join followers on posts.username = followers.blogname and followers.username = ?", username).Order("posts.views DESC, posts.created_at DESC").Find(&posts).Error
	if err != nil {
		fmt.Println(err)
		return nil
	}

	return posts
}
