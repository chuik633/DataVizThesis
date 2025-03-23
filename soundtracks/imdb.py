import requests
from bs4 import BeautifulSoup

interstellar_link  = "https://www.imdb.com/title/tt0816692/"
headers = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
}
response = requests.get(interstellar_link, headers=headers)
# print(response.status_code)
soup = BeautifulSoup(response.text, 'html.parser')


#tags
tags_html = soup.find_all(class_='ipc-chip')
tags = [tag.text.strip() for tag in tags_html if tag.text != "Back to top"]


#genres
genres_html = soup.find_all(attrs = {'data-testid':'storyline-genres'})
genres = [genre.text for genre in genres_html]
print(genres)