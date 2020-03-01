package models

import (
	"encoding/json"
	"fmt"
	"os"
)

var globalConfig *Config

type Config struct {
	Database struct {
		Username string `json:"username"`
		Password string `json:"password"`
		Host     string `json:"host"`
		Name     string `json:"dbname"`
	} `json:"database"`
	TokenPassword string `json:"token_password"`
	Port string `json:"port"`
	DataFolder string `json:"data_folder"`
}

func LoadConfiguration(file string) Config {
	var config Config
	configFile, err := os.Open(file)
	defer configFile.Close()
	if err != nil {
		fmt.Println(err.Error())
	}
	jsonParser := json.NewDecoder(configFile)
	jsonParser.Decode(&config)
	globalConfig = &config
	return config
}

func GetConfig() *Config {
	return globalConfig
}
