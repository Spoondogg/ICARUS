/**
    A Footer that sticks to bottom of page    
*/
class STICKYFOOTER extends NAVBAR {
    /**
        Constructs a footer stuck to the bottom of the viewpane
        @param {EL} node The object to contain the table
        @param {MODEL} model stickyfooter model
     */
    constructor(node, model) {
        super(node, model);
        this.el.setAttribute('class', 'stickyfooter');

        // TODO: Abstract SCROLLER into its own class

        //this.scrollerLeft = new BUTTON(this, '', ICON.CHEVRON_LEFT);
        //this.scrollerLeft.addClass('scroller-left');
        //this.scrollerLeft.el.onclick = this.scrollLeft.bind(this);

        // A horizontally scrolling menu of ARTICLE tabs
        //this.scroller = new BUTTONGROUP(this, 'scroller');

        //this.buttonWidth = 160;
        //this.buttonsDisplayed = 4;
        //this.scroller.el.style.width = this.buttonWidth * this.buttonsDisplayed + 'px';

        //this.scrollerRight = new BUTTON(this, '', ICON.CHEVRON_RIGHT);
        //this.scrollerRight.addClass('scroller-right');
        //this.scrollerRight.el.onclick = this.scrollRight().bind(this);

        //this.navLeft = new UL(this.scroller, new MODEL(new ATTRIBUTES('nav navbar-nav navbar-left')));

        //this.scrollIndex = 0; // Increments of 3 buttons wide

        //this.container = new EL(this, 'DIV', { 'class': 'container' });
        //this.text = new SPAN(this.container, { 'style': 'float:right;' }, text);
    }

    /**
        Adds a drop down tab to the nav-bar that relates to the given article model
        @param {ARTICLE} model The article element
        @param {EL} target The nav menu to append, if blank, append to navLeft
        @returns {DROPDOWNTAB} A dropdown tab
    
    addDropDownTab(model, target) {
        console.log(model);
        target = target ? target : this.navLeft;

        let dropDown;
        try {
            dropDown = new DROPDOWNTAB(target, model);
            
            dropDown.anchor.el.onclick = function () {
                console.log('Showing article "' + model.label + '"...');
                $('article').hide();
                $(model.el).show();
                $('.dropdown-tab').removeClass('active');
                $(this).toggleClass('active');
            };

            //target.addListItem(dropDown);

        } catch (e) {
            console.log('Unable to add dropdown tab.');
            console.log(e);
        }

        return dropDown;
    }*/

    /*
    widthOfList() {
        return this.navLeft.li.length * this.buttonWidth;
    }

    scrollRight() {
        console.log('clicked scroller right:' + (this.navLeft.li.length - this.buttonsDisplayed));
        if (this.scrollIndex >= 0 && this.scrollIndex < this.navLeft.li.length - this.buttonsDisplayed) {
            $(this.navLeft.el).animate({ left: "-=" + this.buttonWidth + "px" }, 'fast', function () {

            });
            this.scrollIndex++;
        }
        console.log('scrollIndex: ' + this.scrollIndex);
    }

    scrollLeft() {
        console.log('clicked scroller left:' + (this.navLeft.li.length - this.buttonsDisplayed));
        if (this.scrollIndex <= this.navLeft.li.length && this.scrollIndex > 0) {
            $(this.navLeft.el).animate({ left: "+=" + this.buttonWidth + "px" }, 'fast', function () {

            });
            this.scrollIndex--;
        }
        console.log('scrollIndex: ' + this.scrollIndex);
    }
    */
}