import React, { useState } from "react";
import "./styles.css";

function QuoteGenerator() {
  const [quote, setQuote] = useState(null);
  const [image, setImage] = useState(null); // State to store the image URL

  const marilynQuotes = [
    "Imperfection is beauty, madness is genius, and it's better to be absolutely ridiculous than absolutely boring.",
    "A wise girl knows her limits, a smart girl knows that she has none.",
    "We should all start to live before we get too old. Fear is stupid. So are regrets.",
    "I don't want to make money, I just want to be wonderful.",
    "A career is born in public - talent in privacy.",
    "It's all make believe, isn't it?",
    "Who said nights were for sleep?",
    "Most importantly, keep smiling. Because life is a beautiful thing and there's so much to smile about.",
    "Give a girl the right shoes and she can conquer the world.",
    "We are all of us stars, and we deserve to twinkle.",
    "A woman knows by intuition, or instinct, what is best for herself.",
    "I restore myself when I'm alone.",
    "I don't know who invented high heels, but all women owe him a lot!",
    "I'm very definitely a woman and I enjoy it.",
    "I don't mind making jokes, but I don't want to look like one.",
    "I'm good, but I'm no angel. I do sin, but I'm not the devil. I'm just a small girl in a big world trying to find someone to love.",
    "I am not interested in money. I just want to be wonderful.",
    "If you can make a woman laugh, you can make her do anything.",
    "If I'd observed all the rules, I'd never have got anywhere.",
    "I've never dropped anyone I believed in.",
    "It's better to be unhappy alone than unhappy with someone.",
    "I don't mind living in a man's world, as long as I can be a woman in it.",
    "I've been on a calendar, but I've never been on time.",
    "I am not a victim of emotional conflicts. I am human.",
    "I have too much imagination to be a housewife.",
    "I'm one of the world's most self-conscious people. I really have to struggle.",
    "I knew I belonged to the public and to the world, not because I was talented or even beautiful, but because I had never belonged to anything or anyone else.",
    "The truth is I've never fooled anyone. I've let men sometimes fool themselves.",
    "I've always felt toward the slightest scene, even if all I had to do in a scene was just to come in and say, 'Hi,' that the people ought to get their money's worth and that this is an obligation of mine, to give them the best you can get from me.",
    "When you're young and healthy you can plan on Monday to commit suicide, and by Wednesday you're laughing again.",
    "Boys are meant to ruin your lipstick not mascara.",
    "To all the girls that think you're fat because you're not a size zero, you're the beautiful one, it's society who's ugly.",
  ];

  const getRandomQuote = () => {
    const randomIndex = Math.floor(Math.random() * marilynQuotes.length);
    setQuote(marilynQuotes[randomIndex]);
    fetchImage(); // Fetch a new image when a new quote is generated
  };

  const fetchImage = async () => {
    try {
      const response = await fetch(
        "https://commons.wikimedia.org/w/api.php?action=query&list=search&srsearch=Marilyn%20Monroe&format=json&origin=*"
      );
      const data = await response.json();

      const imagePromises = data.query.search.map(async (result) => {
        const pageId = result.pageid;

        // Fetch images from each page
        const imageResponse = await fetch(
          `https://commons.wikimedia.org/w/api.php?action=query&prop=images&pageids=${pageId}&format=json&origin=*`
        );
        const imageData = await imageResponse.json();
        return imageData.query.pages[pageId].images;
      });

      const imagesArray = await Promise.all(imagePromises);
      const allImages = imagesArray.flat(); // Flatten the array

      // Filter for images that likely belong to Marilyn Monroe
      const filteredImages = allImages.filter((img) =>
        img.title.toLowerCase().includes("marilyn monroe")
      );

      if (filteredImages.length > 0) {
        // Select a random image from the filtered images
        const randomImageIndex = Math.floor(Math.random() * filteredImages.length);
        const imageName = filteredImages[randomImageIndex].title; // Get a random image title
        const imageUrl = `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(imageName)}`;
        setImage(imageUrl); // Set the image URL
      } else {
        // Fallback to a default image if none are found
        setImage("default-image-url-here"); // Add a default image URL
      }
    } catch (error) {
      console.error("Error fetching image:", error);
      setImage(null); // Reset image on error
    }
  };

  return (
    <div className="inside">
      <button onClick={getRandomQuote} className="new-quote-button">New Quote</button>
      {quote && (
        <div className="white">
          <h2>{quote}</h2>
          <p>- Marilyn Monroe</p>
        </div>
      )}
      {image && <img src={image} alt="Marilyn Monroe" />} {/* Display the image */}
    </div>
  );
  
}

export default QuoteGenerator;
