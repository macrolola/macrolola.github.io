(function() {

    // Name of the class we add to words once they have been hovered.
    // This makes them "disappear" from the page, while still filling up space.
    const HOVERED_CLASS_NAME = "hovered";

    // Container for the text to be processed
    const textContainer = document.getElementById("text");

    // Wrap all words in a <span class="word"> tag
    wrapWordsInText(textContainer);

    // Attach event handlers to each <span class="word"> tag
    textContainer.querySelectorAll(".word").forEach(word => {

	// On mouse hover, hide the word and create a falling "clone"
	word.addEventListener("mouseenter", event => {
	    let el = event.target;

	    if (el.classList.contains(HOVERED_CLASS_NAME)) {
		// We already processed this word, nothing to do here
		return;
	    }

	    // Mark the word as "hovered"
	    el.classList.add(HOVERED_CLASS_NAME);

	    // Create a falling clone of the word
	    makeFallingClone(el);
	});

	// Handle clicks on the word.
	// You can do various stuff, but in this example:
	// - A plain click restores the word to its original state
	// - Ctrl+click creates another falling clone of the word
	word.addEventListener("click", event => {
	    let el = event.target;

	    if (event.ctrlKey) {
		makeFallingClone(el);
	    }
	    else {
		el.classList.remove(HOVERED_CLASS_NAME);
	    }

	});
    });

})();


function randomNumber(min, max) {
    // Generate a random number within range
    return min + (Math.random() * (max - min));
}


function randomAnimationDuration(min, max) {
    // Generate a random number in seconds
    return `${randomNumber(min, max)}s`;
}


function makeFallingClone(element) {
    let rect = element.getBoundingClientRect();
    let text = element.innerText;
    let { top, left } = rect;

    let newElement = document.createElement("span");
    newElement.classList.add("falling");

    // Copy over some style attributes.
    // We don't want to copy *everything* so it's best to do this manually on a case-by-case basis.
    let style = window.getComputedStyle(element);
    newElement.style.fontSize = style.fontSize;
    newElement.style.fontWeight = style.fontWeight;
    newElement.style.fontStyle = style.fontStyle;
    newElement.style.textDecoration = style.textDecoration;
    newElement.style.color = style.color;

    newElement.style.position = "fixed";
    newElement.style.top = top;
    newElement.style.left = left;
    newElement.style.animationDuration = randomAnimationDuration(2, 10);

    let wordElem = document.createElement("span");
    wordElem.classList.add("spinning");
    wordElem.innerText = text;
    wordElem.style.animationDuration = randomAnimationDuration(2, 10);
    newElement.append(wordElem);

    newElement.addEventListener("animationend", event => {

	// When the animation ends (and the element is outside the
	// page), destroy the element.
	if (event.animationName === "fallingWord") {
	    document.body.removeChild(newElement);
	}

    });

    document.body.append(newElement);
}


function wrapWordsInText(node) {
    if (node.nodeType === Node.TEXT_NODE) {
	// Wrap all the words in text nodes inside a <span class="word">
	let words = textToWords(node.textContent);
	node.replaceWith(...words);
    }
    else {
	// Recursively process.
	// Use Array.from() so the node list doesn't change during iteration.
	Array.from(node.childNodes).forEach(node => {
	    wrapWordsInText(node);
	})
    }
}


function textToWords(text) {
    let elements = [];
    text.trim(/\s+/).split(/\s+/).filter(x=>!!x).forEach(word => {
	let wEl = document.createElement("span");
	wEl.classList.add("word")
	wEl.textContent = word;
	elements.push(wEl);
	elements.push(document.createTextNode(" ")); // Space after the word
    });
    return elements;
}
