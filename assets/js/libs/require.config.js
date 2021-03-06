var jam = {
    "packages": [
        {
            "name": "d3",
            "location": "../assets/js/libs/d3",
            "main": "d3.v2.js"
        }
    ],
    "version": "0.2.11",
    "shim": {
        "d3": {
            "exports": "d3"
        }
    }
};

if (typeof require !== "undefined" && require.config) {
    require.config({packages: jam.packages, shim: jam.shim});
}
else {
    var require = {packages: jam.packages, shim: jam.shim};
}

if (typeof exports !== "undefined" && typeof module !== "undefined") {
    module.exports = jam;
}