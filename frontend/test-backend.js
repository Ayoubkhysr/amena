async function testBackend() {
  try {
    const productsRes = await fetch("http://localhost:8081/api/products");
    const productsPage = await productsRes.json();
    const product = productsPage.content.find(p => p.id === 24) || productsPage.content[0];
    
    if (!product) {
       console.log("No product found");
       return;
    }
    
    console.log("Before Update:", product.name, "SubcategoryIds:", product.subcategoryIds);
    
    // Find subcategories for Sol et Surface
    const catRes = await fetch("http://localhost:8081/api/categories");
    const cats = await catRes.json();
    const subcat = cats.find(c => c.name === "Lave Sol");
    console.log("Found Subcategory Lave Sol:", subcat);
    
    const updatePayload = {
      sku: product.sku,
      name: product.name,
      slug: product.slug,
      price: product.price,
      categoryId: product.categoryId,
      subcategoryIds: subcat ? [subcat.id] : [],
      isActive: product.isActive
    };
    
    console.log("Sending Payload:", JSON.stringify(updatePayload));
    
    const updateRes = await fetch("http://localhost:8081/api/products/" + product.id, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatePayload)
    });
    
    if (!updateRes.ok) {
       console.log("Update Failed:", updateRes.status, await updateRes.text());
       return;
    }
    
    const updated = await updateRes.json();
    console.log("After Update:", updated.name, "SubcategoryIds:", updated.subcategoryIds);
    
  } catch(e) {
    console.error(e);
  }
}

testBackend();
