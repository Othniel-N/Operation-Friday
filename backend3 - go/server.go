package main

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"

	"github.com/gorilla/mux"
	_ "github.com/lib/pq"
)

const (
	host     = "127.0.0.1"
	port     = 5432
	user     = "postgres"
	password = "abs"
	dbname   = "testing"
)

var db *sql.DB

type User struct {
	Typess      string `json:"typess"`
	NameOfUser  string `json:"nameofuser"`
}

func main() {
	// Initialize the database connection
	connStr := fmt.Sprintf("host=%s port=%d user=%s password=%s dbname=%s sslmode=disable",
		host, port, user, password, dbname)

	var err error
	db, err = sql.Open("postgres", connStr)
	if err != nil {
		log.Fatal(err)
	}
	defer db.Close()

	// Create a new router using mux
	router := mux.NewRouter()

	// Define a route to retrieve data from PostgreSQL
	router.HandleFunc("/postgres", getPostgresData).Methods("GET")

	port := os.Getenv("PORT")
	if port == "" {
		port = "3003"
	}

	// Start the Go web server
	log.Printf("Server is running on port %s", port)
	log.Fatal(http.ListenAndServe(":"+port, router))
}

func getPostgresData(w http.ResponseWriter, r *http.Request) {
	rows, err := db.Query("SELECT typess, nameofuser FROM usernames") // Replace "your_table_name" with your actual table name
	if err != nil {
		log.Printf("Error executing query: %v", err)
		http.Error(w, "Internal Server Error", http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	var users []User
	for rows.Next() {
		var user User
		err := rows.Scan(&user.Typess, &user.NameOfUser)
		if err != nil {
			log.Printf("Error scanning row: %v", err)
			http.Error(w, "Internal Server Error", http.StatusInternalServerError)
			return
		}
		users = append(users, user)
	}

	if err := rows.Err(); err != nil {
		log.Printf("Error iterating rows: %v", err)
		http.Error(w, "Internal Server Error", http.StatusInternalServerError)
		return
	}

	// Convert the result to JSON and send it as the response
	w.Header().Set("Content-Type", "application/json")
	if err := json.NewEncoder(w).Encode(users); err != nil {
		log.Printf("Error encoding JSON: %v", err)
		http.Error(w, "Internal Server Error", http.StatusInternalServerError)
		return
	}
}
