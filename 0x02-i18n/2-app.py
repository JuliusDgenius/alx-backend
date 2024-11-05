#!/usr/bin/env python3
"""
Defines a simple flask app
"""


from flask import Flask, render_template, request
from flask_babel import Babel


class Config(object):
    """Config class

    Returns:
            type: description
    """
    LANGUAGES = ['en', 'fr']
    BABEL_DEFAULT_LOCALE = 'en'
    BABEL_DEFAULT_TIMEZONE = 'UTC'


# configure the flask app
app = Flask(__name__)
app.config.from_object(Config)
babel = Babel(app)


@babel.localeselector
def get_locale():
    """Gets the locale

    Returns:
            type: description
    """
    return request.accept_languages.best_match(app.config['LANGUAGES'])


@app.route('/')
def index():
    """
    index route
    """
    return render_template('2-index.html')


if __name__ == '__main__':
    app.run(port="5000", host="0.0.0.0", debug=True)
