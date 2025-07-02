import requests
from bs4 import BeautifulSoup
import markdown
from bs4.element import Tag

# Define the base URL for the WeChat Mini Program Server-Side API documentation
BASE_URL = "https://developers.weixin.qq.com/miniprogram/dev/OpenApiDoc/"

# Function to scrape API documentation

def scrape_wechat_api():
    # Send a request to the base URL
    response = requests.get(BASE_URL)
    response.raise_for_status()

    # Parse the HTML content
    soup = BeautifulSoup(response.text, 'html.parser')

    # Find all links in the left-hand navigation menu
    nav_links = soup.select('.markdown_nav a')

    # Initialize a list to store API documentation
    api_docs = []

    # Iterate over each link and scrape the API details
    for link in nav_links:
        href = link.get('href')
        if href:
            category_url = f"{BASE_URL}{href}"
            category_name = link.text.strip()
            print(f"Scraping category: {category_name} from {category_url}")  # Debug output

            # Request the category page
            category_response = requests.get(category_url)
            category_response.raise_for_status()
            category_soup = BeautifulSoup(category_response.text, 'html.parser')

            # Find all API endpoints in the category
            api_endpoints = category_soup.select('h2, h3, p, table')  # More generic selectors

            for endpoint in api_endpoints:
                # Extract API details
                api_name_elem = endpoint.find_previous('h2')
                api_description_elem = endpoint.find_next('p')
                request_method_elem = endpoint.find_next('p')
                request_url_elem = endpoint.find_next('p')

                if api_name_elem and api_description_elem and request_method_elem and request_url_elem:
                    api_name = api_name_elem.text.strip()
                    api_description = api_description_elem.text.strip()
                    request_method = request_method_elem.text.strip()
                    request_url = request_url_elem.text.strip()

                    print(f"Scraping endpoint: {api_name}")  # Debug output

                    # Extract request parameters
                    request_params = []
                    request_table = endpoint.find_next(lambda tag: isinstance(tag, Tag) and tag.name == 'table')
                    if isinstance(request_table, Tag):
                        for param in request_table.select('tr'):
                            cols = param.find_all('td')
                            if len(cols) == 4:
                                request_params.append({
                                    'Parameter': cols[0].text.strip(),
                                    'Type': cols[1].text.strip(),
                                    'Required': cols[2].text.strip(),
                                    'Description': cols[3].text.strip()
                                })

                    # Extract response parameters
                    response_params = []
                    response_table = endpoint.find_next(lambda tag: isinstance(tag, Tag) and tag.name == 'table')
                    if isinstance(response_table, Tag):
                        for param in response_table.select('tr'):
                            cols = param.find_all('td')
                            if len(cols) == 3:
                                response_params.append({
                                    'Parameter': cols[0].text.strip(),
                                    'Type': cols[1].text.strip(),
                                    'Description': cols[2].text.strip()
                                })

                    # Extract response examples
                    success_response_elem = endpoint.find_next('pre')
                    error_response_elem = endpoint.find_next('pre')

                    success_response = success_response_elem.text.strip() if success_response_elem else ""
                    error_response = error_response_elem.text.strip() if error_response_elem else ""

                    # Append the structured data to the api_docs list
                    api_docs.append({
                        'Category': category_name,
                        'API Name': api_name,
                        'Description': api_description,
                        'Request Method': request_method,
                        'Request URL': request_url,
                        'Request Parameters': request_params,
                        'Response Parameters': response_params,
                        'Success Response': success_response,
                        'Error Response': error_response
                    })

    # Convert the structured data to Markdown format
    markdown_content = ""
    for doc in api_docs:
        markdown_content += f"## {doc['Category']}\n"
        markdown_content += f"### {doc['API Name']}\n"
        markdown_content += f"**Description:** {doc['Description']}\n"
        markdown_content += f"**Request Method:** {doc['Request Method']}\n"
        markdown_content += f"**Request URL:** {doc['Request URL']}\n"
        markdown_content += "**Request Parameters:**\n"
        markdown_content += "| Parameter | Type | Required | Description |\n"
        markdown_content += "|-----------|------|----------|-------------|\n"
        for param in doc['Request Parameters']:
            markdown_content += f"| {param['Parameter']} | {param['Type']} | {param['Required']} | {param['Description']} |\n"
        markdown_content += "**Response Parameters:**\n"
        markdown_content += "| Parameter | Type | Description |\n"
        markdown_content += "|-----------|------|-------------|\n"
        for param in doc['Response Parameters']:
            markdown_content += f"| {param['Parameter']} | {param['Type']} | {param['Description']} |\n"
        markdown_content += "**Successful Response Example:**\n"
        markdown_content += f"```json\n{doc['Success Response']}\n```\n"
        markdown_content += "**Failed Response Example:**\n"
        markdown_content += f"```json\n{doc['Error Response']}\n```\n"

    # Save the Markdown content to a file
    with open('.cursor/docs/wechat-miniprogram-server-api.mdc', 'w', encoding='utf-8') as file:
        file.write(markdown_content)

# Run the scraper function
if __name__ == "__main__":
    scrape_wechat_api()
