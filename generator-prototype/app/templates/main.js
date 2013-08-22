require.config({
    paths: {
        "bootstrap": "../lib/bootstrap.min.js"
    }
});

require([
    'app'
    ],
    function(app) {
        app.sayHi();
    }
);
