document.addEventListener("DOMContentLoaded", () => {
    const imageFiles = [
        "WhatsApp Image 2025-09-08 at 01.00.20 (1).jpeg",
        "WhatsApp Image 2025-09-08 at 01.00.20 (2).jpeg",
        "WhatsApp Image 2025-09-08 at 01.00.20 (3).jpeg",
        "WhatsApp Image 2025-09-08 at 01.00.20 (4).jpeg",
        "WhatsApp Image 2025-09-08 at 01.00.20.jpeg",
        "WhatsApp Image 2025-09-08 at 01.01.06.jpeg",
        "WhatsApp Image 2025-09-08 at 01.00.19.jpeg"
    ];

    const imageGallery = document.getElementById("image-gallery");

    if (imageGallery && imageFiles.length > 0) {
        const totalImages = imageFiles.length;
        const angle = 360 / totalImages;

        imageFiles.forEach((file, index) => {
            const span = document.createElement("span");
            const img = document.createElement("img");

            span.style.cssText = `--i:${index + 1}; --angle:${angle}deg;`;
            
            img.src = `../assets/photobooth/${file}`; 
            img.alt = `Photo ${index + 1}`;

            span.appendChild(img);
            imageGallery.appendChild(span);
        });
        
        imageGallery.style.cssText = `transform-style: preserve-3d;`;
    } else if (imageGallery) {
        imageGallery.innerHTML = "<p>Nu am găsit imagini în lista furnizată.</p>";
    }
});