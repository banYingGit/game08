/**
 * Created by banYing on 2017/8/24 0024.
 */


/* 全局变量
 * atuoTime60: 倒计时
 * speed：降落速度  可选值 drop15 drop13  drop11  drop09
 * level：当前等级 默认为 1级
 * beadNum：珠子基数
 * beatArr 当前数组
 * ansNum：当前等级答题次数
 * errorNum：当前错误次数
 * levelData: 每个的等级三次答题情况  格式：[{level1:[]},level2:[]......]
 * chose ：返回数据 存储每个等级选择是否正确  yes：答对  No：答错
 *
 */

var atuoTime60,
    speed = "drop15",
    level = 1,
    beadNum = 5,
    beatArr = [],
    ansNum = 0,
    errorNum = 0,
    levelData = [],
    chose = [];


_event();

// 游戏内事件处理
function _event() {

    $('#goScreen2').click(function () {

        $('#screen1').remove()
        $('#screen2').show()

    })

    $('#goPractice').click(function () {

        $('#screen2').hide()

        $('#list').show().attr('data-role', 'practice')

        _setPart()

    })

    $('#goTest').click(function () {

        $('#screen3').remove()

        $('#list').show().attr('data-role', 'test')

        $('#stopBntBox').show()

        $('#list .processB').show()

        $('#processB ul li').eq(0).children('p').addClass('correct-big')
        _setPart()


    })


    $('#stop').click(function () {

        clearInterval(atuoTime60)

        $('#stopBox').show()

        $('#list').hide()

    })
    $('#continue').click(function () {

        $('#stopBox').hide()
        $('#list').show()

        var $i = $('#hideDrop').text()


        _time($i, function () {

            var $level = "level" + level,

                $obj = {};
            chose.push("无")
            $obj[$level] = chose
            console.log('ansNum', ansNum)
            if (ansNum >= 2) {

                //设置进度条
                _setProcess()

                levelData.push($obj)

                //进入新等级 清空本级当前值
                ansNum = 0

                errorNum = 0

                beatArr = []

                level = level + 1

                chose = []

            } else {
                ansNum = ansNum + 1
            }

            if (level >= 10) {

                //全部游戏结束
                console.log('60秒到了level >= 10，自动结束')

                $('#list').remove()

                $('#over').show()

                _over()


            } else {

                _setPart()

            }

        })


    })
    $('.button[data-role="out"]').click(function () {

        _out()
    })


}


// 点击按钮事件处理
function _clickBtn(e) {

    var $dataRole = $(e.target).attr('data-role'),

        //获取当前数组最大值
        getMax = Math.max.apply(this, beatArr)

    //禁止双击
    $('#basinA , #basinB').removeAttr('onclick')

    ansNum = ansNum + 1

    $(e.target).addClass('basinB')

    // console.log('当前答题次数', ansNum)

    if ($('#list').attr('data-role') == 'practice') {

        //此处是练习  不记录对错 但是要显示对错

        if ($dataRole == getMax) {

            //此处说明点击正确
            $(e.target).attr('data-result', '✔')

        } else {

            $(e.target).attr('data-result', '✖')
        }

        if (ansNum >= 3) {

            //进入新等级 清空本级当前值
            ansNum = 0

            beatArr = []


            setTimeout(function () {

                $('#screen3').show()

                $('#list').hide()


            }, 2000)

        } else {
            setTimeout(function () {
                _setPart()
            }, 2000)
        }


    } else {


        //此处是正式答题

        var $level = "level" + level,

            $obj = {};


        if ($dataRole == getMax) {

            //此处说明点击正确
            $(e.target).attr('data-result', '✔')

            chose.push("Yes")


        } else {

            //此处说明点击错误
            $(e.target).attr('data-result', '✖')

            chose.push("NO")

            errorNum = errorNum + 1

            console.log('已经错误次数', errorNum)

        }


        $obj[$level] = chose

        // console.log('$obj', $obj)


        if (errorNum >= 2) {

            levelData.push($obj)

            //错两个及两个以上，则全部游戏结束

            setTimeout(function () {

                $('#list').remove()

                $('#over').show()

                _over()


            }, 2000)

            return

        }


        if (ansNum >= 3) {

            //设置进度条
            _setProcess()

            levelData.push($obj)

            //进入新等级 清空本级当前值
            ansNum = 0

            errorNum = 0

            beatArr = []

            level = level + 1

            chose = []

        }
        setTimeout(function () {

            if (level >= 10) {

                //全部游戏结束

                $('#list').remove()

                $('#over').show()

                _over()


            } else {

                _setPart()

            }


        }, 2000)


    }


    // console.log('$dataRole', $dataRole)
    // console.log('getMax', getMax)

}


//设置答题界面 _setPart
function _setPart() {

    //清空界面
    $('#basinA , #basinB').removeAttr('onclick').removeAttr('data-role').removeAttr('data-result')

    $('#basinA , #basinB').removeClass('basinB')

    if (level <= 3) {

        speed = "drop15"

    } else if (level <= 5) {

        speed = "drop13"

    } else if (level <= 7) {

        speed = "drop11"

    } else if (level <= 9) {

        speed = "drop09"

    }

    if (level == 1) {

        beadNum = 5

    } else if (level == 2 || level == 4 || level == 6 || level == 8) {

        beadNum = 7

    } else if (level == 3 || level == 5 || level == 7 || level == 9) {

        beadNum = 9

    }

    console.log('level，speed，beadNum>>>>>>', level, speed, beadNum)

    //smallBeat 禁止为0
    var $random = _random(beadNum),

        smallBeat = $random == 0 ? (beadNum - 1) : $random

    beatArr = [];

    //少珠子
    beatArr.push(smallBeat)
    //多珠子
    beatArr.push(beadNum)

    //重新排列大小珠子位置
    var newBeat = _getArrayItems(beatArr, 2)

    $('#basinA').attr({'data-role': newBeat[0], 'onclick': '_clickBtn(event)'})

    $('#basinB').attr({'data-role': newBeat[1], 'onclick': '_clickBtn(event)'})

    _beatDropA(newBeat[0])

    setTimeout(function () {

        _beatDropB(newBeat[1])

    }, 500)

    console.log('当前数组为：', newBeat)

    if ($('#list').attr('data-role') != 'practice') {

        clearInterval(atuoTime60)

        _time(60, function () {

            var $level = "level" + level,

                $obj = {};
            chose.push("无")
            $obj[$level] = chose
            console.log('ansNum', ansNum)
            if (ansNum >= 2) {

                //设置进度条
                _setProcess()

                levelData.push($obj)

                //进入新等级 清空本级当前值
                ansNum = 0

                errorNum = 0

                beatArr = []

                level = level + 1

                chose = []

            } else {
                ansNum = ansNum + 1
            }

            if (level >= 10) {

                //全部游戏结束
                console.log('60秒到了level >= 10，自动结束')

                $('#list').remove()

                $('#over').show()

                _over()


            } else {

                _setPart()

            }

        })
    }

}

/*** 设置进度条
 ***/
function _setProcess() {

    // var $el = part == "A" ? $('#processA ul') : $('#processB ul')

    $('#processB ul li').eq(level - 1).children('p').addClass('correct').removeClass('correct-big')

    $('#processB ul li').eq(level).children('p').addClass('correct-big')


}


//游戏结束
function _over() {

    clearInterval(atuoTime60)
    /* ajax 请求接口路径，返回json 数据
     * levelData: 每个的等级三次答题情况
     *
     * */

    var param = {
        levelData: levelData
    }

    console.log('当前返回参数', JSON.stringify(param))

}

//游戏退出
function _out() {

    console.log('游戏退出')

}

/*** 果实降落A
 * i：执行次数
 * fn：降落结束回调
 ***/
function _beatDropA(i, fn) {

    var $beadW = $('.part').width()

    var atuoTime

    $('#basinA').addClass('even-no')

    var timeFn = function () {

        i = i - 1

        $('#partA').append('<div style="height: ' + $beadW * 0.26 + 'px" class="bead ' + speed + '"></div>')


        if (i == 0) {

            clearInterval(atuoTime)

            fn && fn.call(this)

            setTimeout(function () {

                $('#partA').children('.bead').remove()
                $('#basinA').removeClass('even-no')

            }, 1800)

        }

    }

    atuoTime = setInterval(timeFn, 300);

}

function _beatDropB(i, fn) {


    var $beadW = $('.part').width()

    var atuoTime

    $('#basinB').addClass('even-no')

    var timeFn = function () {

        i = i - 1

        $('#partB').append('<div style="height: ' + $beadW * 0.26 + 'px" class="bead ' + speed + '"></div>')


        if (i == 0) {

            clearInterval(atuoTime)

            fn && fn.call(this)

            setTimeout(function () {

                $('#partB').children('.bead').remove()
                $('#basinB').removeClass('even-no')

            }, 1800)

        }

    }

    atuoTime = setInterval(timeFn, 500);

}


/*** 倒计时
 * i：时间
 * fn：倒计时结束回调
 ***/
function _time(i, fn) {


    var timeFn = function () {

        $('#hideDrop').text(i)

        i = i - 1

        $('#time').text(i)

        if (i == 0) {

            clearInterval(atuoTime60)

            fn && fn.call(this)

        }

    }

    atuoTime60 = setInterval(timeFn, 300);


}

/*** 数组随机
 * arr：数组
 * num：随机个数
 ***/
function _getArrayItems(arr, num) {

    var array = [];

    for (var index in arr) {

        array.push(arr[index]);
    }

    var return_array = [];

    for (var i = 0; i < num; i++) {

        if (array.length > 0) {

            var arrIndex = Math.floor(Math.random() * array.length);

            return_array[i] = array[arrIndex];

            array.splice(arrIndex, 1);

        } else {
            break;
        }
    }
    return return_array;
}

/*** 可均衡获取0到n的随机整数。
 * n：数组
 ***/
function _random(n) {

    return Math.floor(Math.random() * n)
}
