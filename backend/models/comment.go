package models

import (
	"fmt"
	"github.com/jinzhu/gorm"
	u "unblog/utils"
)

type Comment struct {
	gorm.Model
	PostID   uint   `json:"postid"`
	ParentID uint   `json:"parentid"`
	Likes    uint   `json:"likes"`
	Username string `json:"username"`
	Content  string `json:"content"`
}

func (comment *Comment) Comment() map[string]interface{} {
	post := GetPostByID(comment.PostID)
	if post == nil {
		return u.Message(false, "Post not found")
	}
	parent := Comment{}
	if comment.ParentID != 0 {
		err := GetDB().Table("comments").Where("id = ?", comment.ParentID).First(&parent).Error
		if err != nil {
			return u.Message(false, "Thread not found")
		}
	}

	GetDB().Create(comment)
	resp := u.Message(true, "success")
	return resp
}

func Like(id string) bool {
	comment := Comment{}
	if comment.ParentID != 0 {
		err := GetDB().Table("comments").Where("id = ?", id).First(&comment).Error
		if err != nil {
			return false
		}
	}
	comment.Likes = comment.Likes + 1
	GetDB().Save(comment)
	return true
}

func GetComments(post *Post) []*Comment {
	comments := make([]*Comment, 0)
	err := GetDB().Table("comments").Where("post_id = ?", post.ID).Order("created_at DESC").Find(&comments).Error
	if err != nil {
		fmt.Println(err)
		return nil
	}
	return comments
}
