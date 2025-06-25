

class Slider {
    constructor(id) {
        this.id = id;
        this.wrapper = document.querySelector("#" + id + " .q-wrapper");
        this.wrapper = document.querySelector("#" + id + " .q-wrapper");
        this.carousel = document.querySelector("#" + id + " .q-carousel");
        this.firstCardWidth = this.carousel.querySelector("#" + id + " .q-card").offsetWidth;
        this.arrowBtns = document.querySelectorAll("#" + id + " .q-wrapper i");
        this.carouselChildrens = [...this.carousel.children];

        this.isDragging = false, this.isAutoPlay = true, this.startX, this.startScrollLeft, this.timeoutId;

        // Get the number of cards that can fit in the carousel at once
        this.cardPerView = Math.round(this.carousel.offsetWidth / this.firstCardWidth);

        // Insert copies of the last few cards to beginning of carousel for infinite scrolling
        this.carouselChildrens.slice(-this.cardPerView).reverse().forEach(card => {
            this.carousel.insertAdjacentHTML("afterbegin", card.outerHTML);
        });

        // Insert copies of the first few cards to end of carousel for infinite scrolling
        this.carouselChildrens.slice(0, this.cardPerView).forEach(card => {
            this.carousel.insertAdjacentHTML("beforeend", card.outerHTML);
        });

        // Scroll the carousel at appropriate postition to hide first few duplicate cards on Firefox
        this.carousel.classList.add("no-transition");
        this.carousel.scrollLeft = this.carousel.offsetWidth;
        this.carousel.classList.remove("no-transition");

        // Add event listeners for the arrow buttons to scroll the carousel left and right
        this.arrowBtns.forEach(btn => {
            btn.addEventListener("click", () => {
                this.carousel.scrollLeft += btn.id == this.id + "-left" ? -this.firstCardWidth : this.firstCardWidth;
            });
        });

        this.autoPlay();

        this.carousel.addEventListener("mousedown", this.dragStart);
        this.carousel.addEventListener("mousemove", this.dragging);
        document.addEventListener("mouseup", this.dragStop);
        this.carousel.addEventListener("scroll", this.infiniteScroll);
        this.wrapper.addEventListener("mouseenter", () => clearTimeout(this.timeoutId));
        this.wrapper.addEventListener("mouseleave", this.autoPlay);
    }

    dragStart = (e) => {
        this.isDragging = true;
        this.carousel.classList.add("q-dragging");
        // Records the initial cursor and scroll position of the carousel
        this.startX = e.pageX;
        this.startScrollLeft = this.carousel.scrollLeft;
    }

    dragging = (e) => {
        if (!this.isDragging) return; // if isDragging is false return from here
        // Updates the scroll position of the carousel based on the cursor movement
        this.carousel.scrollLeft = this.startScrollLeft - (e.pageX - this.startX);
    }

    dragStop = () => {
        this.isDragging = false;
        this.carousel.classList.remove("q-dragging");
    }

    infiniteScroll = () => {
        // If the carousel is at the beginning, scroll to the end
        if (this.carousel.scrollLeft === 0) {
            this.carousel.classList.add("no-transition");
            this.carousel.scrollLeft = this.carousel.scrollWidth - (2 * this.carousel.offsetWidth);
            this.carousel.classList.remove("no-transition");
        }
        // If the carousel is at the end, scroll to the beginning
        else if (Math.ceil(this.carousel.scrollLeft) === this.carousel.scrollWidth - this.carousel.offsetWidth) {
            carousel.classList.add("no-transition");
            carousel.scrollLeft = carousel.offsetWidth;
            carousel.classList.remove("no-transition");
        }

        // Clear existing timeout & start autoplay if mouse is not hovering over carousel
        clearTimeout(this.timeoutId);
        if (!this.wrapper.matches(":hover")) this.autoPlay();
    }

    autoPlay = () => {
        if (window.innerWidth < 800 || !this.isAutoPlay) return; // Return if window is smaller than 800 or isAutoPlay is false
        // Autoplay the carousel after every 2500 ms
        this.timeoutId = setTimeout(() => this.carousel.scrollLeft += this.firstCardWidth, 2500);
    }
}




const sliders = document.querySelectorAll(".q-slider-cards");
sliders.forEach(slider => {
    sdr = new Slider(slider.id);
});

