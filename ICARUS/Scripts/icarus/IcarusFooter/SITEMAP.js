/**
    A sitemap typically located at the bottom of the home page    
*/
class SITEMAP {
    /**
        Constructs a SiteMap
        @param {EL} node The element that will contain this object
     */
    constructor(node) {
        this.footer = new EL(node, 'DIV', new MODEL(new ATTRIBUTES('row footer sitemap')));
        this.container = new EL(this.footer, 'DIV', new MODEL(new ATTRIBUTES('container footerlinks')));
        this.list = new EL(this.container, 'UL', new MODEL(new ATTRIBUTES('pull-left')));

        // footerlinks.list item constructor
        this.flink = function (name, href, text) {
            this.list[name] = new EL(this.list, 'LI');
            this.list[name].a = new EL(this.list[name], 'A', new MODEL(new ATTRIBUTES({
                'href': '#' + href
            })), text);
        };

        // Create each footerlink (consider loading from json)
        this.list['home'] = this.flink('home', 'home', 'Home');
        this.list['help'] = this.flink('help', 'help', 'Help');
        this.list['contact'] = this.flink('contact', 'contact', 'Contact');
        this.list['forms'] = this.flink('forms', 'forms', 'Forms');

        this.container.copy = new EL(this.container, 'UL', new MODEL(new ATTRIBUTES('pull-right')));
        this.copy = new EL(this.container.copy, 'LI');
        this.copy.a = new EL(this.copy, 'A', new MODEL(new ATTRIBUTES({
            'href': '#copy'
        })), 'Ryan Dunphy : SpoonMedia');
    }    
}