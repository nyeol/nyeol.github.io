
var $content = $('#content'),
    $ul = $content.find('ul'),
    totalHeight = $content.height(),
    title = $('.title');

var total = OPTIONS.imgs.length,
    step = 0,
    focusIndex = 0;

for (var i = 1; i <= total; i++) {
    var liNode = $('<li>', {
        'data-id': i,
        style: 'display:none; top: ' + totalHeight + 'px; width: 100%;'
    });
    liNode.append($('<img>', {
        src: OPTIONS.imgs[i-1]
    }))
    $ul.append(liNode);
}


showTitle();


$(document).on('click touchend', (e) => {
    e.preventDefault();

    var target = $(e.target);
    var isNext = false;
    if (step > 1 && target.is('img')) {
        var index = target.closest('li').data('id');
        if (focusIndex === index) {
            isNext = true;
        } else {
            focusIndex = index;
            isNext = false;
            display();
        }
    } else {
        isNext = true;
    }

    if (isNext) {
        if (step < total) {
            if (step == focusIndex) {
                step++;
            }
            focusIndex++;
            display();
        }
    }
});

var imgMaxH = 0;

var speed = 600,
    easing = 'easeOutCubic';


function showTitle(){
    title.css({
        position: 'relative',
        top: totalHeight + 'px'
    }).animate({
        top: ((totalHeight - title.height()) / 2) + 'px'
    }, 800)
}   

function hideTitle(){
    title.animate({
        top: -(title.height() + 100) + 'px'
    }, 800)
}

function display() {
    totalHeight = $content.height();

    if (!imgMaxH) {
        hideTitle();
        imgMaxH = $('li[data-id=1]').height();
    }

    if(OPTIONS.perspective){
        displayPespective()
    } else {
        displayRegular()
    }
}

function displayPespective() {

    var center = (totalHeight - imgMaxH) / (total - 1) * (focusIndex - 1) + ((totalHeight - imgMaxH) * Math.sin((total - step) / 10));

    var focusNode = $('li[data-id=' + focusIndex + ']'),
        options = {
            width: 100,
            top: center
        };
    draw(focusNode, options);

    var remainSpace = (center) / (imgMaxH * (focusIndex - 1)) * 100;

    for (var i = focusIndex - 1; i > 0; i--) {
        var node = $('li[data-id=' + i + ']');
        var gap = i - focusIndex;
        options.width = remainSpace * Math.acos(Math.abs(gap) / (focusIndex)) * .96;
        options.top -= imgMaxH * (options.width / 100);

        draw(node, options);
    }

    var remainSpace = (totalHeight - center - imgMaxH) / (imgMaxH * (step - focusIndex + 1)) * 100;
    options.top = center;

    var pastTop = imgMaxH;

    for (var i = focusIndex + 1; i <= step; i++) {

        var node = $('li[data-id=' + i + ']');
        var gap = i - focusIndex;
        if (remainSpace > 60) {
            options.width = remainSpace;
        } else {
            options.width = remainSpace * Math.acos((gap - 1) / (step - focusIndex + 1));
        }

        options.top += pastTop;
        pastTop = (imgMaxH * (options.width / 100));

        draw(node, options);
    }

}

function displayRegular() {

    var center = (totalHeight - imgMaxH) / (total - 1) * (focusIndex - 1) + ((totalHeight - imgMaxH) * Math.sin((total - step) / 10));

    var focusNode = $('li[data-id=' + focusIndex + ']'),
        options = {
            width: 100,
            top: center
        };
    draw(focusNode, options);

    var remainSpace = (center) / (imgMaxH * (focusIndex - 1)) * 100;

    for (var i = focusIndex - 1; i > 0; i--) {
        var node = $('li[data-id=' + i + ']');
        options.width = remainSpace;
        options.top -= imgMaxH * (remainSpace / 100);

        draw(node, options);
    }

    var remainSpace = (totalHeight - center - imgMaxH) / (imgMaxH * (step - focusIndex)) * 100;
    options.top = center;

    var pastTop = imgMaxH;

    for (var i = focusIndex + 1; i <= step; i++) {
        var node = $('li[data-id=' + i + ']');
        options.width = remainSpace;
        options.top += pastTop;
        pastTop = imgMaxH * (remainSpace / 100);

        draw(node, options);
    }

}

function draw($target, { width, top }) {

    $target.show().stop().animate({
        top: top + 'px',
        width: width + '%',
        left: 50 * (1 - width / 100) + '%',
        opacity: OPTIONS.opacity ? width / 100 : 1
    }, speed, easing)

}