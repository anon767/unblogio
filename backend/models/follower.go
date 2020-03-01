package models

import (
	"github.com/jinzhu/gorm"
	u "unblog/utils"
)

type Follower struct {
	gorm.Model
	Blogname string
	Username string
}

func countFollower(blogname string) int {
	count := 0
	GetDB().Table("followers").Where("blogname = ?", blogname).Count(&count)
	return count
}

func alreadyFollowing(username string, blogname string) *Follower {
	follower := &Follower{}
	GetDB().Table("followers").Where("blogname = ? and username = ?", blogname, username).First(follower)
	return follower
}

func GetFollower(blogname string, username string) map[string]interface{} {
	resp := u.Message(true, "success")
	resp["count"] = countFollower(blogname)
	resp["following"] = alreadyFollowing(username, blogname).Username != ""
	return resp
}

func (follower *Follower) Follow() map[string]interface{} {
	tmpFollower := alreadyFollowing(follower.Username, follower.Blogname)
	if follower.Username == tmpFollower.Username {
		GetDB().Unscoped().Delete(tmpFollower)
	} else {
		GetDB().Create(follower)
	}
	return GetFollower(follower.Blogname, follower.Username)
}
