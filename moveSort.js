import Vue from 'vue'
function moveSort(target, $table, callback) {
    var isMoving = false, downing = false, downY, $tbC;

    var prev = -1, after = -1, me, id;

    function sort(prev) {
        var {list} = target, arr = [];
        var thisRecord;
        for (var i = 0; i < list.length; i++) {
            list[i].highlight = false;
            if (list[i].weight == me) {
                thisRecord = list[i];
                thisRecord.highlight = true;
                break;
            }
        }
        if (prev == -1) {
            arr.push(thisRecord);
        }
        list.forEach(function (record) {
            if (record.weight == me) {
                return
            }
            arr.push(record);
            if (record.weight == prev) {
                arr.push(thisRecord)
            }
        });
        target.list = arr
    }

    $table.unbind('mousedown').on('mousedown', 'tr[data-weight]', function (e) {
        downY = e.pageY;
        downing = true;
        var $tr = $(e.target).parents('tr');
        me = $tr.attr('data-weight');
        id = $tr.attr('data-id');
    });
    var getMiddle = function ($item) {
        var top = $item.offset().top;
        var bottom = top + $item.height();
        return (top + bottom) / 2;
    };
    var mousemove = function (e) {
        var pageY = e.pageY;
        if (downing) {
            e.preventDefault();
            e.stopPropagation();
        }
        if (target.list.length <= 1) {
            return
        }
        if (!isMoving && downing && Math.abs(pageY - downY) > 1) {
            isMoving = true;
            var $tr = $(e.target).parent();
            var $tb = $tr.parents('table');
            var {left, top} = $tr.offset();
            var $trC = $tr.clone();
            $trC.css({
                background: '#fff'
            });
            $tbC = $(`<table class="table"></table>`);
            $tbC.append($trC);
            $tbC.css({
                position: 'absolute',
                top: `${top}px`,
                left: `${left + 12}px`,
                "z-index": 100,
                width: $tb.width(),
                opacity: .7
            });
            $('body').append($tbC)
        }
        if (isMoving) {
            $tbC && $tbC.css({
                top: pageY - 20
            });
            prev = -1, after = -1;
            var $trs = $table.find('tr[data-id][data-weight!="' + me + '"]');

            var $first = $($trs[0]);
            var firstMiddle = getMiddle($first);
            if (pageY <= firstMiddle) {
                after = $first.attr('data-weight');
                sort(prev);
                return
            }
            for (var i = 0; i < $trs.length - 1; i++) {
                var $item = $($trs[i]);
                var $next = $($trs[i + 1]);
                var curMiddle = getMiddle($item);
                var nexMiddle = getMiddle($next);
                if (pageY > curMiddle && pageY <= nexMiddle) {
                    prev = $item.attr('data-weight');
                    after = $next.attr('data-weight');
                    sort(prev);
                    return
                }
            }
            var $last = $($trs[$trs.length - 1]);
            var lastMiddle = getMiddle($last);
            if (pageY >= lastMiddle) {
                prev = $last.attr('data-weight');
                sort(prev)
            }
        }
    };
    var mouseup = function () {
        downing = false;
        if (!isMoving) {
            return
        }
        isMoving = false;
        $tbC.remove();
        callback(id, Number(me), Number(prev), Number(after))
    };
    $(document).on('mousemove', mousemove);
    $(document).on('mouseup', mouseup);
}
/**
 * table的行需要有data-id和data-weight属性
 */
Vue.directive('moveSort', {
    inserted(el, binding, vnode){
        moveSort(vnode.context, $(el), binding.value)
    }
});