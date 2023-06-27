Steps to run the container:
    1) Run the following command to build the container image "docker build -t bitspeed ."
    2) Run "docker run -d -p 3000:3000 --name bitspeed bitspeed" to spin up the container
    3) Hit the api from postman at http://localhost:3000/identify