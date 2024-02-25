(function ($) {
    const DebugMode = true;
    $.fn.sfProfile = function (options) {
        const NewChallengerNum = 39;
        const MasterRankNum = 36;
        const LegendRankNum = 37;

        const CharListColumnNum = 6;

        const PlayerName = 'PlayerName';
        const FightersId = 'FightersId';
        const PlayTime = 'PlayTime';
        const ControlerType = 'ControlerType';
        const MessageText = 'MessageText';

        let wrap = $(this);

        let charDataCopy = $.extend([], charData);
        let PlatformArray = platform[0];
        let VoiceChatArray = voicechat[0];

        const bsContainer = 'container-lg cursorDefault';
        const bsSubitem = 'm-1 rounded row p-3 text-primary-emphasis bg-primary-subtle border border-primary-subtle rounded-3';

        function addUpdateEvent(id, type) {
            id.on(type, function (e) {
                previewCard();
            });
        }

        function setTextInfo(id, title) {
            let _container = $('<div>').addClass(bsContainer);
            let _xdiv = $('<div>').addClass(bsSubitem);

            let _playerName = $('<span>').text(title).addClass('col-2 text-center fw-bold');
            let _inputName = $('<input>').attr({ 'id': id, 'type': 'text', 'placeholder': title }).addClass('col');
            _xdiv.append(_playerName);
            _xdiv.append(_inputName);
            _container.append(_xdiv);
            addUpdateEvent(_inputName, 'input');
            wrap.append(_container);
        }

        function setPlatform() {
            let _container = $('<div>').addClass(bsContainer);
            let _xdiv = $('<div>').addClass(bsSubitem);

            let _playerName = $('<span>').text('プラットフォーム').addClass('col-2 text-center fw-bold');
            _xdiv.append(_playerName);

            let _platformDiv = $('<div>').addClass('col text-center');

            $.each(PlatformArray, function (key, val) {
                let _spanPlatform = $('<span>').addClass('m-2 rounded');
                _spanPlatform.text(key);
                _platformDiv.append(_spanPlatform);
                const _aClass = 'fw-bold text-decoration-underline';
                _spanPlatform.on('click', function (e) {
                    let _val = $(this).text();
                    let _isActive = PlatformArray[_val];
                    PlatformArray[_val] = !_isActive;
                    PlatformArray[_val] ? $(this).addClass(_aClass) : $(this).removeClass(_aClass);
                    previewCard();
                });
            });
            _xdiv.append(_platformDiv);

            _container.append(_xdiv);
            wrap.append(_container);
        }

        function setVoiceChat() {
            let _container = $('<div>').addClass(bsContainer);
            let _xdiv = $('<div>').addClass(bsSubitem);

            let _playerName = $('<span>').text('ボイスチャット').addClass('col-2 text-center fw-bold');
            _xdiv.append(_playerName);

            let _platformDiv = $('<div>').addClass('col text-center');

            $.each(VoiceChatArray, function (key, val) {
                let _spanPlatform = $('<span>').addClass('m-2 rounded');
                _spanPlatform.text(key);
                _platformDiv.append(_spanPlatform);
                const _aClass = 'fw-bold text-decoration-underline';
                _spanPlatform.on('click', function (e) {
                    let _val = $(this).text();
                    let _isActive = VoiceChatArray[_val];
                    VoiceChatArray[_val] = !_isActive;
                    VoiceChatArray[_val] ? $(this).addClass(_aClass) : $(this).removeClass(_aClass);
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
            for (let idx = 0; idx < charData.length; idx++) {
                let _charData = charData[idx];
                if (!_charData.active) {
                    continue;
                }

                let _xdiv = $('<div>').addClass('m-1 p-1 rounded row border text-gr flex-nowrap');

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
                _controlType.append(_modern).append(_classic).hide();

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
                _leagueimg.attr('id', `leagueimg${idx}`).hide();//.css({ 'height': '32px', 'object-fit': 'contain' })

                _leagueElem = getLeague(idx);
                _leagueElem.attr('id', `league${idx}`).hide();

                _ximg.addClass('grayScale');
                _chkbox.on('change', function (e) {
                    $(`#league${idx}`).toggle();
                    $(`#leagueimg${idx}`).toggle();
                    _controlType.toggle();
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

                _xdiv.css({ 'height': '64px' });
                _xdiv.append(_chkbox.addClass('col-1 m-2').hide());
                _xdiv.append(_ximglbl.addClass('col-1 m-2'));
                _xdiv.append(_namespan.addClass('col-2 m-2'));
                _xdiv.append(_controlType.addClass('col-2 m-2'));
                _xdiv.append(_leagueimg.addClass('col-2 m-2'));
                _xdiv.append(_leagueElem.addClass('col m-2 flex-shrink-1'));
                _container.append(_xdiv);
            }
            wrap.append(_container);
        }

        function getLeague(charidx, lang = 'en') {
            let _container = $('<div>');
            let _select = $('<select>');
            for (let idx = 0; idx < league.length; idx++) {
                let _option = $('<option>');
                _option.text(league[idx].league[lang]).val(idx);
                _select.append(_option);
            }

            let _stars = $('<select>').hide();
            _select.on('change', function (e) {
                let _selectedIdx = $("option:selected", this).val();
                let _starsAry = league[parseInt(_selectedIdx)].star;

                charDataCopy[charidx].league = league[parseInt(_selectedIdx)].image;

                $(`#leagueimg${charidx}`).attr('src', getRankImage(charidx));
                if (_starsAry.length > 0) {
                    _stars.show();
                    _stars.empty();
                    for (let idx = 0; idx < _starsAry.length; idx++) {
                        let _option = $('<option>');
                        _option.text('★'.repeat(_starsAry[idx])).val(_starsAry[idx]);
                        _stars.append(_option);

                        if (_starsAry[idx] == charDataCopy[charidx].star) {
                            _option.attr("selected", "selected");
                        }
                    }
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
                function getCard(title, body, istiny = false) {
                    let _infoRow = $('<div>').addClass(cardClass);
                    let _infoBody = $('<div>').addClass('card-body');
                    let _infoTitle = $('<h6>').addClass('card-title');
                    let _infotText = $('<div>').addClass('card-text fs-4');
                    if (body.length == 0) {
                        body = '';
                    }
                    if (istiny) {
                        _infoTitle.text(`${title} ${body}`);
                        _infoBody.append(_infoTitle);
                        _infoRow.append(_infoBody);
                    } else {
                        _infoTitle.text(title);
                        _infotText.text(body);
                        if (title.length > 0) {
                            _infoBody.append(_infoTitle);
                        }
                        _infoBody.append(_infotText);
                        _infoRow.append(_infoBody);
                    }
                    return _infoRow;
                }

                function getPlatform(title, body, istiny = false) {
                    let _infoRow = $('<div>').addClass(cardClass);
                    let _infoBody = $('<div>').addClass('card-body');
                    let _infoTitle = $('<h6>').addClass('card-title');
                    let _infotText = $('<div>').addClass('card-text fs-4');


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
                        let _textSpan = $('<span>').text('-');
                        _infotText.append(_textSpan);
                    }

                    if (istiny) {
                        _infoTitle.text(title);

                        _infoBody.append(_infoTitle);
                        //_infoBody.append(_infotText);
                        _infoTitle.append(_infotText);
                        _infoRow.append(_infoBody);
                    } else {
                        _infoTitle.text(title);

                        _infoBody.append(_infoTitle);
                        _infoBody.append(_infotText);
                        _infoRow.append(_infoBody);
                    }
                    return _infoRow;
                }
                let _xdiv = $('<div>').addClass('col');
                let _cardDiv = $('<div>').addClass('card fw-bold m-1 bg-dark');
                let _backImg = $('<img>').addClass('card-img m-1');
                let _cardOverlay = $('<div>').addClass('card-img-overlay');
                _backImg.attr({ 'src': cardImage });


                //_cardDiv.addClass('h-100');

                //----

                let _cardRow = $('<div>').addClass('row');
                let _cardCol1 = $('<div>').addClass('col');
                let _cardCol2 = $('<div>').addClass('col');
                let _cardCol3 = $('<div>').addClass('col');

                _cardRow.append(_cardCol1);
                _cardCol1.append(getCard('プレイヤー名', $(`#${PlayerName}`).val()));

                _cardRow.append(_cardCol2);
                _cardCol2.append(getCard('ユーザコード', $(`#${FightersId}`).val()));
                _cardOverlay.append(_cardRow);

                {
                    _cardRow = $('<div>').addClass('row');
                    _cardCol1 = $('<div>').addClass('col');
                    _cardCol2 = $('<div>').addClass('col');

                    _cardRow.append(_cardCol1);
                    _cardCol1.append(getPlatform('プラットフォーム', PlatformArray, true));

                    _cardRow.append(_cardCol2);
                    _cardCol2.append(getPlatform('ボイスチャット', VoiceChatArray, true));
                    _cardOverlay.append(_cardRow);
                }

                _cardDiv.append(_cardOverlay.removeClass('card-img-overlay'));

                let _imageRow = $('<div>').addClass('row');
                let _imageX = $('<div>').addClass('col ');
                let _imageY = $('<div>').addClass('col-6 ');
                let _imageZ = $('<div>').addClass('col ');
                _imageY.append(_backImg);
                _imageRow.append(_imageX).append(_imageY).append(_imageZ);

                _cardDiv.append(_imageRow);
                {
                    _cardRow = $('<div>').addClass('row');
                    _cardCol1 = $('<div>').addClass('col');
                    _cardCol2 = $('<div>').addClass('col');
                    _cardRow.append(_cardCol1);
                    _cardCol1.append(getCard('プレイ時間帯', $(`#${PlayTime}`).val(), false));

                    _cardRow.append(_cardCol2);
                    _cardCol2.append(getCard('コントローラ', $(`#${ControlerType}`).val(), false));
                    _cardDiv.append(_cardRow);
                }
                {
                    _cardRow = $('<div>').addClass('row');
                    _cardCol1 = $('<div>').addClass('col');
                    _cardCol2 = $('<div>').addClass('col');
                    _cardRow.append(_cardCol1);
                    _cardCol1.append(getCard('', $(`#${MessageText}`).val()));

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
                let _xdiv = $('<div>').addClass('col');

                if (true) {
                    for (let xidx = 0; xidx < charDataCopy.length; xidx += CharListColumnNum) {
                        let _cardGroupDiv = $('<div>').addClass('card-group m-1');
                        for (let cidx = 0; cidx < CharListColumnNum; cidx++) {
                            let _tidx = xidx + cidx;
                            let _charData;
                            if (_tidx > charDataCopy.length - 1) {
                                _tidx = -1;
                                _charData = null;
                            } else {
                                _charData = charDataCopy[_tidx];
                            }
                            if (_charData && !_charData.active) {
                                _charData = null;
                            }
                            _cardGroupDiv.append(getCharCard(_charData, _tidx));
                        }
                        _xdiv.append(_cardGroupDiv);
                    }
                } else {
                    let _cardGroupDiv = $('<div>').addClass('card-group m-1');
                    for (let xidx = 0; xidx < charDataCopy.length; xidx++) {
                        let _charData;
                        _charData = charDataCopy[xidx];
                        if (_charData.favorite) {
                            _cardGroupDiv.append(getCharCard(_charData, xidx));
                        }
                    }
                    _xdiv.append(_cardGroupDiv);
                }
                return _xdiv;
            }
            const cardImage = './img/logo.png';
            $('#ProfileCard').remove();
            let _container = $('<div>').attr('id', 'ProfileCard');
            _container.addClass(bsContainer);
            let _leftDiv = leftSide(cardImage);
            let _rightDiv = rightSide();

            let _xdiv = $('<div>').addClass('row border border-dark rounded p-1 m-1');

            _xdiv.append(_leftDiv);
            _xdiv.append(_rightDiv);
            _container.append(_xdiv);
            $('#ProfileCardMain').append(_container);
        }

        function debugBtn() {
            let _container = $('<div>').addClass(bsContainer);
            let _xdiv = $('<div>').addClass(bsSubitem);

            let _btn = $('<span>').text('debug').attr({ 'id': 'gen', }).addClass('btn-primary m-2 rounded text-center');
            _xdiv.append(_btn);
            _container.append(_xdiv);
            wrap.append(_container);
            $('#gen').on('click', function () {
                previewCard();
            });
        }

        setTextInfo(PlayerName, 'プレイヤー名');
        setTextInfo(FightersId, 'ユーザコード');
        setTextInfo(PlayTime, 'プレイ時間');
        setTextInfo(ControlerType, 'コントローラ');
        setPlatform();
        setVoiceChat();
        setTextInfo(MessageText, 'コメント');
        getCharData();

        if (DebugMode) {
            //debugBtn();
        } else {
            //$(function () { setInterval(function () {previewCard();}, 800); });
        }

        previewCard();
    }
})(jQuery);
