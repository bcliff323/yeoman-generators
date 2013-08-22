define([], 

    function () {
        var app = {};

        app.sayHi = function() {
            console.log('Require App');
        };

        return app;
    }
);