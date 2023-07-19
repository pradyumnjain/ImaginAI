from api.mongo import collection

def search_prompt(cursor=0, size=50, prompt=""):
    """
    Searches for documents in 'search_prompt' that match the provided prompt using text search.

    Args:
        cursor (int): The number of documents to skip.
        size (int): The number of documents to retrieve.
        prompt (str): The search query to match.

    Returns:
        list: A list of documents that match the search query.
    """
    if len(prompt.split(" ")) > 3:
        return {"response": "Too Many keywords"}
    if prompt == "":
        return {"response": "No Keywords provided"}
    query = [
        {
            "$search": {
                "index": "search_prompt",
                "text": {"query": f"{prompt}", "path": {"wildcard": "*"}, "fuzzy": {}},
            }
        },
        {"$limit": size},  # Number of documents to retrieve
        {"$skip": cursor},  # Number of documents to skip
    ]
    result = collection.aggregate(query)
    return list(result)


def search_image(vector=None):
    """
    Searches for images in 'search_image' that are similar to the provided vector using KNN search.

    Args:
        vector (list): A list of floats representing the content embedding vector of the image.

    Returns:
        list: A list of documents that match the search query.
    """
    if vector is None:
        vector = []
    query = [
        {
            "$search": {
                "index": "search_image",
                "knnBeta": {"vector": vector, "path": "content_embedding", "k": 5},
            }
        },
        {"$skip": 100},
        {"$limit": 50},
    ]
    result = collection.aggregate(query)
    return list(result)


def get_home_images(cursor=0, size=50):
    """
    Retrieves a list of image URLs from the 'image_url_list' of documents in the 'stock_data'.

    Args:
        cursor (int): The number of documents to skip.
        size (int): The number of documents to retrieve.

    Returns:
        dict: A dictionary containing a list of image URLs and the next cursor value.
    """
    if collection is None:
        return {}
    query = {}
    documents = list(collection.find(query).skip(cursor).limit(size))
    url_list = [doc["image_url_list"][0].split("/")[-1] for doc in documents]
    next_cursor = cursor + len(url_list)
    return {"url_list": url_list, "next_cursor": next_cursor}
