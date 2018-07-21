/**
    A generic header that appears at the top of most editable elements.

    The Section header contains general options related to this section.

    @see SECTION
    @version 2
*/
class IcarusSectionHeader extends HEADER {
    /**
        Constructs a Container Header
        @param {CONTAINER} container The parent CONTAINER class
        @param {string} label The label that appears in this header
        @param {boolean} showHeader True, show header. False, hide header 
     */
    constructor(container, label, showHeader) {
        super(container);
        this.addClass('section-header noselect');
        this.el.style.display = showHeader ? STYLE.DISPLAY.DEFAULT : STYLE.DISPLAY.NONE;

        // Left aligned button group
        this.left = this.addButtonGroup('btn-group-left');

        // Lock / Unlock Options for this SECTION
        this.btnLock = this.left.addButton('', ICONS.UNLOCK); //
        this.btnLock.addClass('active');
        this.btnLock.addClass('button-lock');

        // Button to collapse SECTION body
        this.label = this.left.addButton(label, ICONS.DOWN);
        this.label.addClass('btn-label text-left');

        // Right aligned button group
        this.right = this.addButtonGroup('pull-right'); 

        // Moves the element up/down one within its container
        this.btnUp = this.right.addButton('', ICONS.ARROW_UP).el.onclick = this.moveUp.bind(this);
        this.btnDown = this.right.addButton('', ICONS.ARROW_DOWN).el.onclick = this.moveDown.bind(this);



        // Create a toggle button with a series of relevant options for this section
        this.options = this.right.addToggleButton('', ICONS.OPTIONS);
        //this.options.list.addGroup(new GROUP('UL', 'CRUD', new MODEL().set('name', 'CRUD')));
        //this.options.list.addGroup(new GROUP('UL', 'ELEMENTS', new MODEL().set('name', 'ELEMENTS')));
        //this.options.list.addGroup(new GROUP('UL', 'UPDATE', new MODEL().set('name', 'UPDATE')));

        this.options.menu.addDropDownMenuGroup('CRUD', new MODEL().set('name', 'CRUD'));
        this.options.menu.addDropDownMenuGroup('ELEMENTS', new MODEL().set('name', 'ELEMENTS'));
        this.options.menu.addDropDownMenuGroup('UPDATE', new MODEL().set('name', 'UPDATE'));

        // Now that everything exists, lock accordingly
        
        //this.options.el.setAttribute('disabled', 'disabled');

        /**
            When clicked, toggles the Lock state of this header.
        */
        this.btnLock.el.onclick = function () {
            this.toggleLock(container);
        }.bind(this);

    }

    /**
     * Moves this element UP one slot
     */
    moveUp() {
        console.log('Move Up');
        let node = $(this.node.el);
        let container = this.node.node.el;
        if (node.prev().length > 0) {
            node.animate({ height: 'toggle' }, 300);
            setTimeout(function () {
                node
                    .prev()
                    .animate({ height: 'toggle' }, 300)
                    .insertAfter(node)
                    .animate({ height: 'toggle' }, 300);
            }, 0);
            setTimeout(function () {
                node.animate({ height: 'toggle' }, 300).delay(300);
            }, 300);
        }
    }

    /**
     * Moves this element DOWN one slot
     */
    moveDown() {
        console.log('Move Down');
        let node = $(this.node.el);
        let container = this.node.node.el;
        if (node.next().length > 0) {
            node.animate({ height: 'toggle' }, 300);
            setTimeout(function () {
                node
                    .next()
                    .animate({ height: 'toggle' }, 300)
                    .insertBefore(node)
                    .animate({ height: 'toggle' }, 300)
                    .delay(300);
            }, 0);
            setTimeout(function () {
                node.animate({ height: 'toggle' }, 300);
            }, 300);
        }
    }
        
    /**
        Locks the Section Header.
    */
    unlock() {
        console.log('Checking if parent is locked');
        console.log(section);

        console.log('Unlocking...');
        this.btnLock.icon.el.className = ICONS.UNLOCK;
        this.options.el.removeAttribute('disabled');
        container.open();
        console.log('Unlocked!');
    }

    /**
        Unlocks this Section Header
    */
    lock() {
        console.log('Locking...');
        let isChildrenOpen = 0;

        // If section is open and we are trying to lock, we must 
        // first lock the children
        console.log('Container has ' + container.children.length + ' child(ren)');
        for (let s = 0; s < container.children.length; s++) {
            if (container.children[s].status === STATUS.OPEN) {
                console.log('Locking ' + container.element + '('+container.getId()+')');
                container.children[s].close();
                container.header.toggleLock();

                //isChildrenOpen = 1;

                //console.log('Failed to lock SECTION.  Child "' + section.children[s].getName() + '" is still open');
                //break;
            } else {
                console.log('Container ' + container.getName() + ' is already locked');
            }
        }

        if (isChildrenOpen === 0) {
            console.log('Children are closed. Closing Container');
            container.close();

            this.btnLock.icon.el.className = ICONS.LOCK;
            $(this.btnLock.el).removeClass('active');

            this.options.el.setAttribute('disabled', 'disabled');

            console.log('Locked');
        }
    }

    /**
        Toggles the Lock state of this header.
        @param {CONTAINER} container A Container that this Header controls
    */
    toggleLock(container) {
        console.log(container.element+'.toggleLock()');
        if (container.status === STATUS.CLOSED) {
            container.open();
        } else {
            container.close();
        }
    }

    /**
        Sets the label in the header to the given value.
        @param {string} label The label to be assigned
    */
    setLabel(label) {
        console.log('Renaming header...');
        if (label) {
            this.label.icon.label.el.innerHTML = label;
        } else {
            try {
                this.prompt = new PROMPT('Relabel Header', 'Set the label for this Header:');
                this.prompt.formGroup.addInput('label', IcarusInputType.TEXT, this.label.icon.label.el.innerHTML);

                /**
                    Sets the Label to the given label value
                */
                this.prompt.buttonGroup.addButton('Rename').el.onclick = function () {
                    this.label.icon.label.el.innerHTML = $(this.prompt.el).find('input[name="label"]')[0].value;
                    this.prompt.hide();
                }.bind(this);

                this.prompt.buttonGroup.addButton('No, Leave it alone!').el.onclick = function () {
                    this.prompt.hide();
                }.bind(this);

                this.prompt.show();

            } catch (e) {
                console.log('Unable to change name for this container\n' + e);
            }
        }
    }

    /**
        Returns the label inner html.
        @returns {string} The label
    */
    getLabel() {
        return this.label.icon.label.el.innerHTML;
    }    
}