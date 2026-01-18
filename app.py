from flask import Flask

app = Flask(__name__)

@app.route("/")
def hello_world():
    return "<h1> this is a sample website which will be used in hackathon</h1>"

if __name__ == "__main__":
    app.run(debug=True)