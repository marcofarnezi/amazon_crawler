# Amazon crawler
This code uses NodeJS and MongoDB to get product information from amazon and create a product list 

## Crawling products

Using a post route is possible to require and insert products results from amazon in a local database

```bash
POST: localhost:3333/products
Body: 
{
	"search": "product name"
}
```

Using a get route is possible to show the products on the database.
```bash
GET: localhost:3333/products?page=1
```