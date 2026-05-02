// import packages
import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import ejs from "ejs";

//create express app
const app = express();
//port number
const port = 3000;

//create app middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

//create database connection
const pool = new pg.Pool({
  user: 'postgres',
  host: 'localhost',  
    database: 'school',
    password: 'Benson6969$',
    port: 5432, // default PostgreSQL port
});

//bd connection 
pool.connect();
//create a route
app.get("/", (req, res) => {
    //const userList = []; // Initialize an empty array to hold users
    //query to get data from database
    pool.query("SELECT * FROM users", (error, results) => {
    if (error) {
      console.error("Error executing query", error.stack);  
        res.status(500).send("Error retrieving data");
    } else {
        console.log(results.rows); // Log the retrieved rows to the console
      //render the index.ejs file with the users data   
      // userList = results.rows; // Assign the retrieved rows to the users variable
      // Render the index.ejs file with the users data  
        res.render("index.ejs", { users: results.rows });
    }
});
});

//create a route to handle form submission
app.post("/submit", (req, res) => {     
  const firstname = req.body.firstName;
  const lastname = req.body.lastName;

  //insert data into database
  pool.query(
    "INSERT INTO users (firstName, lastName) VALUES ($1, $2)",
    [firstname, lastname],
    (error, results) => {
      if (error) {
        console.error("Error executing query", error.stack);
        res.status(500).send("Error inserting data");
      } else {
        // Redirect to home to show updated list
        res.redirect("/");
      }
    }
  );
}); 
//create listener
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});