package models

import (
	"fmt"
	"github.com/jinzhu/gorm"
	_ "github.com/jinzhu/gorm/dialects/postgres"
	"log"
	"math/rand"
	"os"
	"time"
)

var db *gorm.DB

func init() {
	configFile := os.Args[1]
	LoadConfiguration(configFile)
	rand.Seed(time.Now().UnixNano())

	username := GetConfig().Database.Username
	password := GetConfig().Database.Password
	dbName := GetConfig().Database.Name
	dbHost := GetConfig().Database.Host
	log.Printf("Database connect via user: %s , host: %s, dbname: %s", username, dbHost, dbName)
	dbUri := fmt.Sprintf("host=%s user=%s dbname=%s sslmode=disable password=%s", dbHost, username, dbName, password)
	fmt.Println(dbUri)
	conn, err := gorm.Open("postgres", dbUri)
	if err != nil {
		fmt.Print(err)
	}
	db = conn
	db.Debug().AutoMigrate(&Account{}, &Post{}, &File{}, &Rating{}, &Comment{}, &Follower{})
}

func GetDB() *gorm.DB {
	return db
}
