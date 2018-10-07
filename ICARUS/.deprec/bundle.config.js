module.exports = {
    bundle: {
        main: {
            scripts: 'Scripts/icarus/.src/**/*.js',
            styles: [
                'Content/css/icarus/.src/icarus.css'
            ],
            options: {
                uglify: false,
                minCSS: false,
                watch: {
                    scripts: true, // do not watch for changes since these almost never change
                    styles: true
                }
            }
        },
        vendor: {
            scripts: [
                'Scripts/jquery/jquery-3.3.1.js',
                'Scripts/jquery/jquery-ui-1.12.1.js',
                'Scripts/jquery/jquery.validate.js',
                'Scripts/modernizr/modernizr-2.8.3',
                'Scripts/bootstrap/bootstrap.js'
            ]
        }
    }
    //copy: './Content/**/*.{png,svg}'
};