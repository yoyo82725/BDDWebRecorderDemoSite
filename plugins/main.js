var apibase = 'http://127.0.0.1:8002/';
// head上方NAV
$('.timeNav').click(function () {
    $('.timeNav').removeClass('active');
    $('.titleNav').removeClass('active');
    $('.titleNav').eq(0).addClass('active');
    $(this).addClass('active');
});

// head下方NAV
$('.titleNav').click(function () {
    $('.titleNav').removeClass('active');
    $(this).addClass('active');
});

$('.apiLink').click(function () {
    var api = 'shopList';
    var whitchData = $(this).attr('data-api');
    if (!api) return;
    $.ajax({
        type: "GET",
        url: apibase + api,
        data: {
            whitchData: whitchData
        },
        beforeSend: function () {
            showLoading();
        },
        success: function (response) {
            $('#shop_block').html('');
            response.shop.forEach(function (shop) {
                var template = `<a href="#page02" class="hoverOutline">
                                    <img src="${shop}" alt="">
                                </a>`;
                $('#shop_block').append(template);
            });
        },
        complete: function () {
            stopLoading();
        }
    });
});

// routing
if ("onhashchange" in window) {
    $(window).on('hashchange', function (e) {
        console.log('hash changed ' + location.hash);
        $('.pages').hide();
        switch (location.hash) {
            case '#page02':
                var api = 'shopItemDetail';
                $('html').removeClass('bg241').removeClass('bgF5');
                $.ajax({
                    type: "GET",
                    data: {item_id:113679},
                    url: apibase + api,
                    beforeSend: function () {
                        $('.pagesOut').loading();
                    },
                    complete: function () {
                        $('.pagesOut').loading('stop');
                        $('.page02').show();
                    }
                });
                break;
            case '#page03':
                $('html').removeClass('bg241').removeClass('bgF5');
                var api = 'sellerDetail';
                $.ajax({
                    type: "GET",
                    url: apibase + api,
                    beforeSend: function () {
                        $('.pagesOut').loading();
                    },
                    complete: function () {
                        $('.pagesOut').loading('stop');
                        $('.page03').show();
                    }
                });
                break;
            case '#page04':
                $('.page04').show();
                $('html').removeClass('bgF5').addClass('bg241');
                loadTicketList();
                break;
            case '#page05':
                $('.page05').show();
                $('html').removeClass('bg241').addClass('bgF5');
                var api = 'myTicketList';
                $.ajax({
                    type: "GET",
                    url: apibase + api,
                    beforeSend: function () {
                        $('.pagesOut').loading();
                        $('.page05 .apiHide').hide();
                    },
                    success:function(data) {
                        $('.page05 .apiHide').html('');
                        var myTickets = data.tickets;
                        myTickets.forEach(function(ticket){
                            var template = `<div class="p5paper">
                                ${ticket}
                            </div>`;
                            $('.page05 .apiHide').append(template);
                        });
                    },
                    complete: function () {
                        $('.pagesOut').loading('stop');
                        $('.page05 .apiHide').show();
                    }
                });
                break;
            case '#page06':
                $('.page06').show();
                $('html').removeClass('bg241').addClass('bgF5');
                break;
            default:
                $('.page01').show();
                $('html').removeClass('bg241').removeClass('bgF5');
                $('.timeNav').eq(0).click();
                break;
        }
    });
    $(window).trigger('hashchange');
} else {
    alert('沒有 onhashchange');
}

// 首頁看更多
$('#seeMore').hover(function () {
    $('#more').show();
}, function () {
    $('#more').hide();
});

// p6 送出訂閱
$('.page06 .submit_button').click(function(){
    var email = $('#email').val();
    if(!email || !/^[A-Za-z0-9\u4e00-\u9fa5]+((-[A-Za-z0-9\u4e00-\u9fa5]+)|(\.[A-Za-z0-9\u4e00-\u9fa5]+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z]+$/.test(email)) {
        // error
        $('.page06 .error').show();
        $('.page06 .success').hide();
    } else {
        // success
        $('.page06 .error').hide();
        $('.page06 .success').show();
    }
});

function showLoading() {
    $('body').loading();
}

function stopLoading() {
    $('body').loading('stop');
}

// page04 ticketList
function loadTicketList() {
    // 優惠券清單
    var api = 'allTicketList';
    var ticketList = '';
    $.ajax({
        type: "GET",
        url: apibase + api,
        beforeSend: function () {
            $('.pagesOut').loading();
        },
        success: function (data) {
            // 我的優惠券
            var api2 = 'myTicketList';
            ticketList = data.tickets;
            $.ajax({
                type: "GET",
                url: apibase + api2,
                beforeSend: function () {
                    $('.pagesOut').loading();
                    $('.page04 .apiHide').hide();
                },
                success: function (myTickets) {
                    $('.page04 .apiHide').html('');
                    ticketList.forEach(function (ticket) {
                        var template = '';
                        if (!myTickets.tickets.includes(ticket)) {
                            template = `<div class="paper">
                                <div class="txtGroup">
                                    <h1>${ticket}</h1>
                                    <p>有效期限 2020-08-12</p>
                                </div>
                                <div class="button get" onClick="addTicket('${ticket}')">
                                    <span>領取</span>
                                </div>
                                <a class="explain">使用說明</a>
                            </div>`;
                        } else {
                            template = `<div class="paper">
                                <div class="txtGroup">
                                    <h1>${ticket}</h1>
                                    <p>有效期限 2020-08-12</p>
                                </div>
                                <div class="button got">
                                    <span>已領取</span><br>
                                    <a href="#page05">我的優惠券</a>
                                </div>
                                <a class="explain">使用說明</a>
                            </div>`;
                        }
                        $('.page04 .apiHide').append(template);
                    });
                },
                complete: function () {
                    $('.pagesOut').loading('stop');
                    $('.page04 .apiHide').show();
                }
            });
        },
        error:function(){
            $('.pagesOut').loading('stop');
            $('.page04 .apiHide').show();
        }
    });
}

function addTicket(ticket) {
    var api = 'addTicket';
    $.ajax({
        type: "POST",
        url: apibase + api,
        data: {
            ticket: ticket
        },
        beforeSend: function () {
            $('.pagesOut').loading();
        },
        complete: function () {
            loadTicketList();
        }
    });

}

// function regPage02Loading(){
//     $('a[href="#page02"]').click(function(){
//         $('.pagesOut').loading();
//     });
// }