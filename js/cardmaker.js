(function ($) {
    const DebugMode = true;
    $.fn.sfProfile = function (options) {
        const NewChallengerNum = 39;
        const MasterRankNum = 36;
        const LegendRankNum = 37;

        const CardWidth = 1100;//CharListColunNum 7 : 1300、6 のとき1100、CharDataの長さが25以上になると考える
        const MessageBoxHeight = 210;//CharListColunNum 7 : 200 6のとき210

        const CharListColumnNum = 6;

        const PlayerName = 'PlayerName';
        const FightersId = 'FightersId';
        const PlayTime = 'PlayTime';
        const ControlerType = 'ControlerType';
        const MessageText = 'MessageText';

        let userData = { PlayerName: '', FightersId: '', PlayTime: '', ControlerType: '', MessageText: '' };

        let wrap = $(this);

        let charDataCopy = $.extend([], charData);
        let PlatformArray = platform[0];
        let VoiceChatArray = voicechat[0];
        let GenderArray = gender[0];

        const bsMainContainer = 'container-fluid cursorDefault';
        const bsContainer = 'container cursorDefault inputInfo';
        const bsSubitem = 'm-1 rounded row p-3 text-primary-emphasis bg-primary-subtle border border-primary-subtle rounded-3';

        function ImportParam(json) {
            let _importJson = $('#ImportProfileData').val();
            let _loadJson = JSON.parse(_importJson);

            charData = _loadJson[0].charData;
            userData = _loadJson[0].userData;
            platform = _loadJson[0].platform;
            voicechat = _loadJson[0].voicechat;

            //console.log(JSON.stringify(charData));
            let _oldData = charDataCopy;
            let _newData = [];
            let _loopIdx = 0;
            while (_loopIdx < _oldData.length) {
                _charData = _oldData[_loopIdx];
                let _xidx = 0;
                let _isExist = false;
                while (_xidx < charData.length) {
                    if (_charData.name.ja == charData[_xidx].name.ja) {
                        _isExist = true;
                        _newData.push(charData[_xidx]);
                        break;
                    }
                    _xidx++;
                }
                if (!_isExist) {
                    _newData.push(_charData);
                }
                _loopIdx++
            }

            charDataCopy = $.extend([], _newData);
            InitInputForm();
            previewCard();
        }

        function ExportParam() {
            let _expData = '';
            _expData = `[{`;
            _expData += `"charData": ${JSON.stringify(charDataCopy)}`;
            _expData += `, "userData": ${JSON.stringify(userData)}`;
            _expData += `, "platform": [${JSON.stringify(PlatformArray)}]`;
            _expData += `, "voicechat": [${JSON.stringify(VoiceChatArray)}]`;
            _expData += `}]`;
            $('#ExportProfileData').val(_expData);
        }

        function addUpdateEvent(elem, type, id) {
            elem.on(type, function (e) {
                userData[id] = $(this).val();
                previewCard();
            });
        }

        function setTextInfo(id, title) {
            let _container = $('<div>').addClass('TextInfo').addClass(bsContainer);
            let _xdiv = $('<div>').addClass(bsSubitem);

            let _playerName = $('<span>').text(title).addClass('col-2 text-center fw-bold');
            let _inputName = $('<input>').attr({ 'id': id, 'type': 'text', 'placeholder': title }).addClass('col');
            _xdiv.append(_playerName);
            _xdiv.append(_inputName);
            _container.append(_xdiv);
            _inputName.val(userData[id]);
            addUpdateEvent(_inputName, 'input', id);
            wrap.append(_container);
        }

        function setPlatformVC(title, _assortArray) {
            let _container = $('<div>').addClass(bsContainer);
            let _xdiv = $('<div>').addClass(bsSubitem);

            let _titleName = $('<span>').text(title).addClass('col-2 text-center fw-bold');
            _xdiv.append(_titleName);

            let _platformDiv = $('<div>').addClass('col text-center');

            $.each(_assortArray, function (key, val) {
                let _spanPlatform = $('<span>').addClass('m-2 rounded');
                _spanPlatform.text(key);
                _platformDiv.append(_spanPlatform);
                const _aClass = 'fw-bold text-decoration-underline';
                if (val) {
                    _spanPlatform.addClass(_aClass);
                }
                _spanPlatform.on('click', function (e) {
                    let _val = $(this).text();
                    let _isActive = _assortArray[_val];
                    _assortArray[_val] = !_isActive;
                    _assortArray[_val] ? $(this).addClass(_aClass) : $(this).removeClass(_aClass);
                    previewCard();
                });
            });
            _xdiv.append(_platformDiv);

            _container.append(_xdiv);
            wrap.append(_container);
        }

        function getRankImage(idx, size = 's') {
            let _leagueNum = parseInt(charDataCopy[idx].league);
            let _ranknumber = _leagueNum + parseInt(charDataCopy[idx].star);
            if (_ranknumber < 0 || _leagueNum == NewChallengerNum) {
                _ranknumber = NewChallengerNum;
            }
            if (_leagueNum == MasterRankNum || _leagueNum == LegendRankNum) {
                _ranknumber = _leagueNum;
            }
            let _leagueimgsrc = `./img/rank/rank${_ranknumber}_${size}.png`;
            return _leagueimgsrc;
        }

        function getCharData(lang = "ja") {
            let _container = $('<div>').addClass(bsContainer);
            const xdivClass = 'm-1 p-1 rounded border text-gr flex-nowrap';
            for (let idx = 0; idx < charData.length; idx++) {
                let _charData = charData[idx];
                if (!_charData.active) {
                    continue;
                }

                let _xdiv = $('<div>').addClass(xdivClass);

                let _chkboxId = `cb${idx}`;
                let _chkbox = $('<input>').attr('type', 'checkbox').attr('id', _chkboxId);
                _chkbox.css({ 'height': '16px' });

                //キャラ画像
                let _img = _charData.name['en'].toLowerCase() + '.png';
                if (_charData.name.file) {
                    _img = _charData.name.file + '.png';
                }
                let _ximg = $('<img>').attr({ 'src': `./img/char/${_img}` }).css({ 'height': '48px', 'object-fit': 'contain' });
                let _ximglbl = $('<label>').attr('for', _chkboxId);
                _ximglbl.append(_ximg);


                //キャラ名
                let _namespan = $('<label>').text(_charData.name[lang]);
                _namespan.attr('for', _chkboxId);


                //操作タイプ
                let _controlType = $('<div>');
                let _modern = $('<img>').attr({ 'src': 'img/modern.png', 'alt': 'modern' }).css({ 'height': '24px', 'object-fit': 'contain' });
                let _classic = $('<img>').attr({ 'src': 'img/classic.png', 'alt': 'classic' }).css({ 'height': '24px', 'object-fit': 'contain' });;
                charDataCopy[idx].ctrlType.modern ? true : _modern.addClass('grayScale');
                _classic.addClass('grayScale');
                _controlType.append(_modern).append(_classic);

                _modern.on('click', function (e) {
                    let _onoff = charDataCopy[idx].ctrlType.modern;
                    charDataCopy[idx].ctrlType.modern = !_onoff;
                    _modern.toggleClass('grayScale');
                    previewCard();
                });

                _classic.on('click', function (e) {
                    let _onoff = charDataCopy[idx].ctrlType.classic;
                    charDataCopy[idx].ctrlType.classic = !_onoff;
                    _classic.toggleClass('grayScale');
                    previewCard();
                });

                //リーグ
                let _leagueimgsrc = getRankImage(idx);
                let _leagueimg = $('<img>').attr({ 'src': `${_leagueimgsrc}` });
                _leagueimg.css({ 'height': '48px', 'object-fit': 'contain' });
                _leagueimg.attr('id', `leagueimg${idx}`);

                _leagueElem = getLeague(idx);
                _leagueElem.attr('id', `league${idx}`);

                if (!charDataCopy[idx].favorite) {
                    _controlType.invisible();
                    _leagueimg.invisible();
                    _leagueElem.invisible();
                }

                //_ximg.addClass('grayScale');
                charDataCopy[idx].favorite ? _ximg.removeClass('grayScale') : _ximg.addClass('grayScale');
                _chkbox.on('change', function (e) {
                    $(`#leagueimg${idx}`).visibilityToggle();
                    $(`#league${idx}`).visibilityToggle();
                    _controlType.visibilityToggle();
                    let _onoff = $(this).prop('checked');
                    if (_onoff) {
                        _xdiv.addClass(' border-secondary ');
                        _ximg.removeClass('grayScale');
                    } else {
                        _xdiv.removeClass(' border-secondary fw-bold');
                        _ximg.addClass('grayScale');
                    }
                    charDataCopy[idx].favorite = _onoff;
                    //console.log(JSON.stringify(charDataCopy));
                    previewCard();
                });

                _xdiv.addClass('row').css({ 'height': '64px' });
                _xdiv.append(_chkbox.addClass('col-1 m-2').hide());
                _xdiv.append(_ximglbl.addClass('col-1 m-2'));
                _xdiv.append(_namespan.addClass('col-2 m-2'));
                _xdiv.append(_controlType.addClass('col-2 m-2'));
                _xdiv.append(_leagueElem.addClass('col m-2 flex-shrink-1'));
                _xdiv.append(_leagueimg.addClass('col-2 m-2'));
                _container.append(_xdiv);

            }
            wrap.append(_container);
        }

        function getLeague(charidx, lang = 'en') {
            let _container = $('<div>');
            let _select = $('<select>');
            let _selectedIdx = null;
            for (let idx = 0; idx < league.length; idx++) {
                let _option = $('<option>');
                _option.text(league[idx].league[lang]).val(idx);
                if (charDataCopy[charidx].league == league[idx].image) {
                    _option.attr("selected", "selected");
                    _selectedIdx = idx;
                }
                _select.append(_option);
            }

            let _stars = $('<select>');
            let _starsAry = [1, 2, 3, 4, 5];
            for (let idx = 0; idx < _starsAry.length; idx++) {
                let _option = $('<option>');
                _option.text('★'.repeat(_starsAry[idx])).val(_starsAry[idx]);
                _stars.append(_option);
                if (_starsAry[idx] == charDataCopy[charidx].star) {
                    _option.attr("selected", "selected");
                }
            }

            if (_selectedIdx) {
                _starsAry = league[parseInt(_selectedIdx)].star;
                if (_starsAry.length > 0) {
                    _stars.show();
                } else {
                    _stars.hide();
                }
            } else {
                _stars.hide();
            }
            _select.on('change', function (e) {
                let _selectedIdx = $("option:selected", this).val();
                charDataCopy[charidx].league = league[parseInt(_selectedIdx)].image;
                $(`#leagueimg${charidx}`).attr('src', getRankImage(charidx));
                let _starsAry = league[parseInt(_selectedIdx)].star;
                if (_starsAry.length > 0) {
                    _stars.show();
                } else {
                    _stars.hide();
                }
                previewCard();
            });

            _stars.on('change', function (e) {
                let _selectedIdx = $("option:selected", this).val();
                charDataCopy[charidx].star = _selectedIdx;
                $(`#leagueimg${charidx}`).attr('src', getRankImage(charidx));
                previewCard();
            });

            _container.append(_select);
            _container.append(_stars);

            return _container;
        }

        function previewCard() {
            function leftSide(cardImage) {
                /*
            <div class="col">
                <div class="card fw-bold">
                    <img src="./img/char/chunli.png" class="card-img grayScale" alt="...">
 
                    <div class="card-img-overlay">
                        <div class="m-1 p-1 text-dark bg-white border border-success rounded">
                            waka
                        </div>
 
                    </div>
                </div>
            </div>
                */

                const cardClass = 'card m-2';
                function getCard(title, body, id, isCenter = true) {
                    let _infoRow = $('<div>').addClass(cardClass);
                    let _infoBody = $('<div>').attr({ 'id': id });//.addClass('card-body');
                    let _infoTitle = $('<h6>').addClass('m-1');//.addClass('card-title');
                    let _infotText = $('<div>').addClass('m-1');//.addClass('card-text fs-5');
                    if (body.length == 0) {
                        body = '&nbsp;';
                    }

                    _infoTitle.text(title);

                    /*
                    let _isActive = false;
                    let _gender = '';
                    if (id == 'ProfilePlayerName') {
                        $.each(GenderArray, function (key, val) {
                            if (val) {
                                _gender += key;
                                _isActive = true;
                            }
                        });
                    }
                    if (_isActive) {
                        _infoTitle.text(`${title} （性別：${_gender}）`);
                    }
*/
                    _infotText.html(body);
                    if (title.length > 0) {
                        _infoBody.append(_infoTitle);
                    }
                    _infoBody.append(_infotText);
                    _infoRow.append(_infoBody);
                    if (isCenter) {
                        _infotText.addClass('text-center');
                    }

                    return _infoRow;
                }

                function getPlatform(title, body) {
                    let _infoRow = $('<div>').addClass(cardClass);
                    let _infoBody = $('<div>');//.addClass('card-body');
                    let _infoTitle = $('<h6>').addClass('m-1');//.addClass('card-title');
                    let _infotText = $('<div>').addClass('m-1');//.addClass('card-text fs-4');

                    _infotText.addClass('text-center');
                    let _isActive = false;
                    $.each(body, function (key, val) {
                        if (val) {
                            let _img = $('<img>').addClass('p-1 icon');
                            let _item = key;
                            _img.attr({ 'src': `./img/${_item.toLowerCase()}.png` });
                            _infotText.append(_img);
                            _isActive = true;
                        }
                    });
                    if (!_isActive) {
                        let _textSpan = $('<div>').html('&nbsp').addClass('p-1 icon');
                        _infotText.append(_textSpan);
                    }

                    {
                        _infoTitle.text(title);

                        _infoBody.append(_infoTitle);
                        //_infoBody.append(_infotText);
                        _infoTitle.append(_infotText);
                        _infoRow.append(_infoBody);
                    }
                    return _infoRow;
                }
                let _xdiv = $('<div>').addClass('col').attr({ 'id': 'ProfileCardLeft' });

                let _cardDiv = $('<div>').addClass('card fw-bold m-1 bg-dark').attr({ 'id': 'ProfileCardLeftInner' });
                let _backImg = $('<img>').addClass('card-img m-1');
                let _cardOverlay = $('<div>').addClass('card-img-overlay');
                _backImg.attr({ 'src': cardImage });

                let _cardRow = $('<div>').addClass('row');
                let _cardCol1 = $('<div>').addClass('col');
                let _cardCol2 = $('<div>').addClass('col');
                let _cardCol3 = $('<div>').addClass('col');

                {
                    _cardRow.append(_cardCol1);
                    _cardCol1.append(getCard('プレイヤー名', $(`#${PlayerName}`).val(), 'ProfilePlayerName'));

                    _cardRow.append(_cardCol2);
                    _cardCol2.append(getCard('ユーザコード', $(`#${FightersId}`).val(), 'ProfileUserCode'));
                    _cardOverlay.append(_cardRow);
                }

                {
                    _cardRow = $('<div>').addClass('row');
                    _cardCol1 = $('<div>').addClass('col');
                    _cardCol2 = $('<div>').addClass('col');

                    _cardRow.append(_cardCol1);
                    _cardCol1.append(getPlatform('プラットフォーム', PlatformArray));

                    _cardRow.append(_cardCol2);
                    _cardCol2.append(getPlatform('ボイスチャット', VoiceChatArray));
                    _cardOverlay.append(_cardRow);
                }

                _cardDiv.append(_cardOverlay.removeClass('card-img-overlay'));

                let _imageRow = $('<div>').addClass('row');
                let _imageX = $('<div>').addClass('col');
                let _imageY = $('<div>').addClass('col-8');
                let _imageZ = $('<div>').addClass('col');
                _imageY.append(_backImg);
                _imageRow.append(_imageX).append(_imageY).append(_imageZ);

                _cardDiv.append(_imageRow);
                {
                    _cardRow = $('<div>').addClass('row');
                    _cardCol1 = $('<div>').addClass('col');
                    _cardCol2 = $('<div>').addClass('col');
                    _cardRow.append(_cardCol1);
                    _cardCol1.append(getCard('プレイ時間帯', $(`#${PlayTime}`).val(), 'ProfilePlayTime'));

                    _cardRow.append(_cardCol2);
                    _cardCol2.append(getCard('コントローラ', $(`#${ControlerType}`).val(), 'ProfileControlerType'));
                    _cardDiv.append(_cardRow);
                }
                {
                    _cardRow = $('<div>').addClass('row');
                    _cardCol1 = $('<div>').addClass('col');
                    _cardRow.append(_cardCol1);
                    let _message = $(`#${MessageText}`).val();
                    let _messageDiv = getCard('', _message, 'ProfileComment', false);
                    _messageDiv.css({ height: MessageBoxHeight });
                    _cardCol1.append(_messageDiv);

                    _cardDiv.append(_cardRow);
                }


                _xdiv.append(_cardDiv);
                return _xdiv;
            }

            function rightSide() {
                /*
                            <div class="col">
                <div class="card-group m-1">
                    <div class="card text-center fw-bold">
                        <img src="./img/char/ryu.png" class="card-img grayScale" alt="...">
                        <img src="./img/rank/rank34_l.png" class="card-img" alt="...">
 
                        <div class="card-img-overlay">
                            <img src="./img/modern.png" class="card-img imgSmallType1" alt="...">
                            <img src="./img/classic.png" class="card-img imgSmallType1 invisible" alt="...">
 
                        </div>
                    </div>
                */
                function getCharCard(charData, idx) {
                    let _cardDiv = $('<div>').addClass('card text-center fw-bold').addClass('bg-dark');
                    let _cardOverlay = $('<div>').addClass('card-img-overlay');

                    let _charImg = $('<img>').addClass('card-img');
                    let _rankImg = $('<img>').addClass('card-img');

                    const grayBgColor = 'bg-secondary';

                    if (charData && charData.active) {
                        let _img = charData.name['en'].toLowerCase() + '.png';
                        if (charData.name.file) {
                            _img = charData.name.file + '.png';
                        }
                        _charImg.attr({ 'src': `./img/char/${_img}` });
                        if (!charData.favorite) {
                            _charImg.addClass('grayScale');
                            _rankImg.addClass('grayScale');
                            _charImg.addClass(grayBgColor);
                            _rankImg.addClass(grayBgColor);
                        } else {
                            //_rankImg.addClass('bg-dark');
                            _cardDiv.removeClass('bg-dark').addClass('border border-dark');
                        }

                        _rankImg.attr({ 'src': getRankImage(idx, 'l') });

                        if (charData.favorite) {
                            let _modernImg = $('<img>').addClass('card-img imgSmallType1');
                            _modernImg.attr({ 'src': "./img/modern.png" });

                            if (charData.ctrlType.modern) {
                                _cardOverlay.append(_modernImg);
                            }
                            let _classicImg = $('<img>').addClass('card-img imgSmallType1');
                            if (charData.ctrlType.modern && charData.ctrlType.classic) {
                                _classicImg.addClass('imgClassic');
                            }

                            _classicImg.attr({ 'src': "./img/classic.png" });

                            if (charData.ctrlType.classic) {
                                _cardOverlay.append(_classicImg);
                            }
                        }
                    } else {
                        _charImg.attr({ 'src': `./img/char/logo_sq_footer.png` });
                        _rankImg.attr({ 'src': '' });
                    }

                    _cardDiv.append(_charImg).append(_rankImg);
                    _cardDiv.append(_cardOverlay);

                    return _cardDiv;
                }
                let _xdiv = $('<div>').addClass('col').attr({ 'id': 'ProfileCardRight' });

                let _favOnlyMode = false;
                let _favoriteCnt = 0;
                for (let xidx = 0; xidx < charDataCopy.length; xidx++) {
                    let _charData;
                    _charData = charDataCopy[xidx];
                    if (_charData && _charData.favorite) {
                        _favoriteCnt++;
                    }
                }
                let _columnNum = CharListColumnNum;
                if (_favOnlyMode && _favoriteCnt > 0) {
                    // _columnNum = _favoriteCnt;
                }

                let _loopIdx = 0;
                let _cardGroupDiv = $('<div>');
                let _sup = _columnNum - (charDataCopy.length % _columnNum);
                if (_favOnlyMode) {
                    //_sup = 0;
                }
                while (_loopIdx < charDataCopy.length + _sup) {
                    let _appendCnt = _cardGroupDiv.children().length;
                    if (_appendCnt % _columnNum == 0) {
                        _cardGroupDiv = $('<div>').addClass('card-group m-1');
                        _xdiv.append(_cardGroupDiv);
                    }
                    _charData = charDataCopy[_loopIdx];
                    if (_charData && !_charData.active) {
                        _charData = null;
                    }
                    let _charCardInfo = $('<div>');
                    _charCardInfo = getCharCard(_charData, _loopIdx);
                    _cardGroupDiv.append(_charCardInfo);

                    _loopIdx++
                }

                return _xdiv;
            }
            const cardImage = './img/logo.png';
            $('#ProfileCard').remove();
            let _container = $('<div>').attr('id', 'ProfileCard');
            _container.addClass(bsMainContainer);
            _container.css({ width: CardWidth });

            let _leftDiv = leftSide(cardImage);
            let _rightDiv = rightSide();

            let _xdiv = $('<div>').addClass('row border border-dark rounded p-1 m-1');
            /* */
            //_xdiv.css({ width: 1280, height: 840 });
            //_xdiv.css({ width: 900, height: 640 });
            // $('#ProfileCardMain').css({ width: 1280, height: 840 });
            //_xdiv.addClass('CaptureZone');

            _xdiv.append(_leftDiv);
            _xdiv.append(_rightDiv);
            _container.append(_xdiv);
            $('#ProfileCardMain').append(_container);
        }

        $('#BtnImportProfile').on('click', function (e) {
            ImportParam();
        });

        $('#BtnExportProfile').on('click', function (e) {
            ExportParam();
        });

        function InitInputForm() {
            PlatformArray = platform[0];
            VoiceChatArray = voicechat[0];
            $('.inputInfo').remove();
            setTextInfo(PlayerName, 'プレイヤー名');
            //setPlatformVC('性別', GenderArray);
            setTextInfo(FightersId, 'ユーザコード');

            setTextInfo(PlayTime, 'プレイ時間帯');
            setTextInfo(ControlerType, 'コントローラ');
            setPlatformVC('プラットフォーム', PlatformArray);
            setPlatformVC('ボイスチャット', VoiceChatArray)
            setTextInfo(MessageText, 'コメント');
            getCharData();
        }


        InitInputForm();
        previewCard();

        /*
                let test = $(".CaptureZone").get(0);
                // to canvas
                $('.toCanvas').click(function (e) {
                    html2canvas(test).then(function (canvas) {
                        // canvas width
                        var canvasWidth = canvas.width;
                        // canvas height
                        var canvasHeight = canvas.height;
                        // render canvas
                        $('.toCanvas').after(canvas);
                        // show 'to image' button
                        $('.toPic').show(1000);
                        // convert canvas to image
                        $('.toPic').click(function (e) {
                            var img = Canvas2Image.convertToImage(canvas, canvasWidth, canvasHeight);
                            // render image
                            $(".toPic").after(img);
                            // save
                            $('#save').click(function (e) {
                                let type = $('#sel').val(); // image type
                                let w = $('#imgW').val(); // image width
                                let h = $('#imgH').val(); // image height
                                let f = $('#imgFileName').val(); // file name
                                w = (w === '') ? canvasWidth : w;
                                h = (h === '') ? canvasHeight : h;
                                // save as image
                                Canvas2Image.saveAsImage(canvas, w, h, type, f);
                            });
                        });
                    });
                });
        */

    }

    $.fn.visible = function () {
        return this.css('visibility', 'visible');
    };

    $.fn.invisible = function () {
        return this.css('visibility', 'hidden');
    };

    $.fn.visibilityToggle = function () {
        return this.css('visibility', function (i, visibility) {
            return (visibility == 'visible') ? 'hidden' : 'visible';
        });
    };
})(jQuery);
