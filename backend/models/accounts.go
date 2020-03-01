package models

import (
	"github.com/dgrijalva/jwt-go"
	"github.com/jinzhu/gorm"
	"golang.org/x/crypto/bcrypt"
	"log"
	"strings"
	u "unblog/utils"
)

/*
JWT claims struct
*/
type Token struct {
	UserId uint
	jwt.StandardClaims
}

//a struct to rep user account
type Account struct {
	gorm.Model
	Username string `json:"username"`
	Email    string `json:"email"`
	Password string `json:"password"`
	Image    string `json:"image"`
	Token    string `json:"token";sql:"-"`
}

func (account *Account) doesEmailExist() bool {
	//Email must be unique
	temp := &Account{}
	//check for errors and duplicate emails
	err := GetDB().Table("accounts").Where("email = ?", account.Email).First(temp).Error
	if err != nil && err != gorm.ErrRecordNotFound {
		return false
	}
	if temp.Email != "" {
		return true
	}
	return false
}
func (account *Account) doesUsernameExist() bool {
	//Email must be unique
	temp := &Account{}
	//check for errors and duplicate emails
	err := GetDB().Table("accounts").Where("username = ?", account.Username).First(temp).Error
	if err != nil && err != gorm.ErrRecordNotFound {
		return false
	}
	if temp.Username != "" {
		return true
	}
	return false
}

//Validate incoming user details...
func (account *Account) Validate() (map[string]interface{}, bool) {

	if !strings.Contains(account.Email, "@") {
		return u.Message(false, "Email address is required"), false
	}
	if len(account.Username) < 2 {
		return u.Message(false, "Username is required and should have at least 2 characters"), false
	}

	if len(account.Password) < 6 {
		return u.Message(false, "Password is required and should have at least 6 characters"), false
	}

	if account.doesEmailExist() {
		return u.Message(false, "Email address already in use by another user."), false
	}
	if account.doesUsernameExist() {
		return u.Message(false, "Username already in use by another user."), false
	}
	return u.Message(false, "Requirement passed"), true
}

func (account *Account) Create() map[string]interface{} {

	if resp, ok := account.Validate(); !ok {
		return resp
	}

	hashedPassword, _ := bcrypt.GenerateFromPassword([]byte(account.Password), bcrypt.DefaultCost)
	account.Password = string(hashedPassword)

	GetDB().Create(account)

	if account.ID <= 0 {
		return u.Message(false, "Failed to create account, connection error.")
	}

	//Create new JWT token for the newly registered account
	tk := &Token{UserId: account.ID}
	token := jwt.NewWithClaims(jwt.GetSigningMethod("HS256"), tk)
	tokenString, _ := token.SignedString([]byte(GetConfig().TokenPassword))
	account.Token = tokenString

	account.Password = "" //delete password
	log.Printf("User created: %s", account.Username)
	response := u.Message(true, "Account has been created")
	response["account"] = account
	return response
}

func Login(email, password string) map[string]interface{} {

	account := &Account{}
	err := GetDB().Table("accounts").Where("email = ?", email).First(account).Error
	if err != nil {
		if err == gorm.ErrRecordNotFound {
			return u.Message(false, "Email address not found")
		}
		return u.Message(false, "Connection error. Please retry")
	}

	err = bcrypt.CompareHashAndPassword([]byte(account.Password), []byte(password))
	if err != nil && err == bcrypt.ErrMismatchedHashAndPassword { //Password does not match!
		return u.Message(false, "Invalid login credentials. Please try again")
	}
	//Worked! Logged In
	account.Password = ""

	//Create JWT token
	tk := &Token{UserId: account.ID}
	token := jwt.NewWithClaims(jwt.GetSigningMethod("HS256"), tk)
	tokenString, _ := token.SignedString([]byte(GetConfig().TokenPassword))
	account.Token = tokenString //Store the token in the response

	resp := u.Message(true, "Logged In")
	resp["account"] = account
	return resp
}

func GetUser(u uint) *Account {

	acc := &Account{}
	GetDB().Table("accounts").Where("id = ?", u).First(acc)
	if acc.Email == "" { //User not found!
		return nil
	}

	acc.Password = ""
	return acc
}

func GetUserByName(u string) *Account {
	acc := &Account{}
	GetDB().Table("accounts").Where("username = ?", u).First(acc)
	if acc.Email == "" { //User not found!
		return nil
	}

	acc.Password = ""
	return acc
}
