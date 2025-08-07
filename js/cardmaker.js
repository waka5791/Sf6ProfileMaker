(function ($) {
    const DebugMode = true;
    $.fn.sfProfile = function (options) {
        const MasterRankNum = [36, 37, 40, 41, 42];
        const LegendRankNum = [37];
        const NewChallengerNum = 39;


        const CharListColumnNum = 8;
        let MessageBoxHeight = 180;//CharListColumnNum 7 : 180 6のとき210
        let CardWidth = 1250;//CharListColumnNum 7 : 1250、6 のとき1100、CharDataの長さが25以上になると考える
        let LeftSideColumn = 6;

        let MFOn = false;
        let MostFavoriteChar = null;

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

        let IsUserDataUpdate = false;

        const bsMainContainer = 'container-fluid cursorDefault';
        const bsContainer = 'container cursorDefault inputInfo';
        const bsSubitem = 'm-1 rounded row p-3 text-primary-emphasis bg-primary-subtle border border-primary-subtle rounded-3';

        function AdjustCardSize() {
            switch (CharListColumnNum) {
                case 6:
                    MessageBoxHeight = 210;
                    CardWidth = 1100;
                    break;
                case 7:
                    MessageBoxHeight = 175;
                    CardWidth = 1250;
                    break;
                case 8:
                    //MessageBoxHeight = 140;
                    //CardWidth = 1400;
                    MessageBoxHeight = 174;
                    CardWidth = 1400;
                    LeftSideColumn = 6;
                    break;
                default:
                    break;
            }
        }

        function ImportParam(json) {
            ToggleBadge($('#BtnExportProfile'), false);
            IsUserDataUpdate = false;
            let _loadJson = null;
            if (json) {
                _loadJson = json;
            } else {
                let _importJson = $('#ImportProfileData').val();
                _loadJson = JSON.parse(_importJson);
            }

            _XcharData = _loadJson[0].charData;
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
                while (_xidx < _XcharData.length) {
                    if (_charData.name.ja == _XcharData[_xidx].name.ja && _XcharData[_xidx].active) {
                        _isExist = true;
                        _newData.push(_XcharData[_xidx]);
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
            PreviewCard(false);
        }

        function ExportParam() {
            ToggleBadge($('#BtnExportProfile'), false);
            IsUserDataUpdate = false;
            function ClipboardCopy(_copyText, _msg) {
                if (navigator.clipboard == undefined) {
                    window.clipboardData.setData('Text', _copyText);
                } else {
                    navigator.clipboard.writeText(_copyText).then(
                        () => {
                            /* clipboard successfully set */
                        },
                        () => {
                            /* clipboard write failed */
                            let _textArea = document.createElement('textarea');
                            _textArea.value = _copyText;
                            document.body.appendChild(_textArea);
                            _textArea.select();
                            document.execCommand('copy');
                            _textArea.parentElement.removeChild(_textArea);
                        },
                    );
                }
                alert(_msg);
            };

            let _expJsonData = {};
            _expJsonData.charData = charDataCopy;
            _expJsonData.userData = userData;
            _expJsonData.platform = [PlatformArray];
            _expJsonData.voicechat = [VoiceChatArray];
            let _copyText = JSON.stringify(_expJsonData, null, "\t");
            _copyText = `[${_copyText}]`;
            ClipboardCopy(_copyText, "クリップボードコピーしました。\r\nメモ帳などでファイルに保存してください。\r\n保存した内容を次回更新時にロードすることで再利用できます。");


        }

        function SetSample(isReset = false) {
            [1, 3, 13, 17, 20, 21].forEach((_idx) => {
                let _dmyChar = charDataCopy[_idx];
                _dmyChar.favorite = !isReset;
                if (_idx == 17) {
                    _dmyChar.ctrlType.classic = !isReset;
                } else {
                    _dmyChar.ctrlType.modern = !isReset;
                }
                _dmyChar.league = isReset ? '-1000' : '0';
            });

            userData.PlayerName = isReset ? '' : 'サンプル';
            userData.FightersId = isReset ? '' : '123456789';
            userData.PlayTime = isReset ? '' : '21時～23時';
            userData.ControlerType = isReset ? '' : 'パッド';
            userData.MessageText = isReset ? '' : 'これはサンプルです。<><>よろしくお願いします。';

            PlatformArray.steam = !isReset;
            VoiceChatArray.discord = !isReset;
        }

        function ResetParam() {
            SetSample(true);

            let _expJsonData = {};
            _expJsonData.charData = charDataCopy;
            _expJsonData.userData = userData;
            _expJsonData.platform = [PlatformArray];
            _expJsonData.voicechat = [VoiceChatArray];
            ImportParam([_expJsonData]);
            $('#ImportProfileData').val('');
        }

        function LoadSample() {
            SetSample();

            let _expData = '';
            _expData = `[{`;
            _expData += `"charData": ${JSON.stringify(charDataCopy)}`;
            _expData += `, "userData": ${JSON.stringify(userData)}`;
            _expData += `, "platform": [${JSON.stringify(PlatformArray)}]`;
            _expData += `, "voicechat": [${JSON.stringify(VoiceChatArray)}]`;
            _expData += `}]`;
            $('#ImportProfileData').val(_expData);
        }

        function AddUpdateEvent(elem, type, id) {
            elem.on(type, function (e) {
                userData[id] = $(this).val();
                PreviewCard(true);
            });
        }

        function SetTextInfo(id, title) {
            let _container = $('<div>').addClass('TextInfo').addClass(bsContainer);
            let _xdiv = $('<div>').addClass(bsSubitem);

            let _playerName = $('<span>').text(title).addClass('col-2 text-center fw-bold');
            let _inputName = $('<input>').attr({ 'id': id, 'type': 'text'/*, 'placeholder': title*/ }).addClass('col');
            _xdiv.append(_playerName);
            _xdiv.append(_inputName);
            _container.append(_xdiv);
            _inputName.val(userData[id]);
            AddUpdateEvent(_inputName, 'input', id);
            wrap.append(_container);
        }

        function SetPlatformVC(title, _assortArray) {
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
                    PreviewCard(true);
                });
            });
            _xdiv.append(_platformDiv);

            _container.append(_xdiv);
            wrap.append(_container);
        }

        function GetCharImage(charData, profile = "") {
            let _charImg = $('<img>');
            let _img = charData.name['en'].toLowerCase() + '.png';
            if (charData.name.file) {
                _img = charData.name.file + '.png';
            }
            if (!charData.active) {
                _img = 'random.png';
            }
            _charImg.attr({ 'src': `./img/char/${profile}${_img}` });
            return _charImg;
        }

        function GetRankImage(idx, size = 's') {
            let _leagueNum = parseInt(charDataCopy[idx].league);
            let _ranknumber = _leagueNum + parseInt(charDataCopy[idx].star);
            if (_ranknumber < 0 || _leagueNum == NewChallengerNum) {
                _ranknumber = NewChallengerNum;
            }
            if (MasterRankNum.includes(_leagueNum)) {
                _ranknumber = _leagueNum;
            }
            let _leagueimgsrc = `./img/rank/rank${_ranknumber}_${size}.png`;
            return _leagueimgsrc;
        }

        function GetRankImageByData(charData, size = 's') {
            let _leagueNum = parseInt(charData.league);
            let _ranknumber = _leagueNum + parseInt(charData.star);
            if (_ranknumber < 0 || _leagueNum == NewChallengerNum) {
                _ranknumber = NewChallengerNum;
            }
            if (MasterRankNum.includes(_leagueNum)) {
                _ranknumber = _leagueNum;
            }
            let _leagueimgsrc = `./img/rank/rank${_ranknumber}_${size}.png`;
            return _leagueimgsrc;
        }

        function GetCharData(lang = "ja") {
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
                    PreviewCard(true);
                });

                _classic.on('click', function (e) {
                    let _onoff = charDataCopy[idx].ctrlType.classic;
                    charDataCopy[idx].ctrlType.classic = !_onoff;
                    _classic.toggleClass('grayScale');
                    PreviewCard(true);
                });

                //リーグ
                let _leagueimgsrc = GetRankImage(idx);
                let _leagueimg = $('<img>').attr({ 'src': `${_leagueimgsrc}` });
                _leagueimg.css({ 'height': '48px', 'object-fit': 'contain' });
                _leagueimg.attr('id', `leagueimg${idx}`);

                _leagueElem = GetLeague(idx);
                _leagueElem.attr('id', `league${idx}`);

                if (!charDataCopy[idx].favorite) {
                    _controlType.invisible();
                    _leagueimg.invisible();
                    _leagueElem.invisible();
                }

                charDataCopy[idx].favorite ? _ximg.removeClass('grayScale') : _ximg.addClass('grayScale');

                _chkbox.on('click', function (e) {
                    $(`#leagueimg${idx}`).visibilityToggle();
                    $(`#league${idx}`).visibilityToggle();
                    _controlType.visibilityToggle();

                    let _onoff = charDataCopy[idx].favorite;
                    _onoff = !_onoff;
                    if (_onoff) {
                        _xdiv.addClass(' border-secondary ');
                        _ximg.removeClass('grayScale');
                    } else {
                        _xdiv.removeClass(' border-secondary fw-bold');
                        _ximg.addClass('grayScale');
                    }
                    charDataCopy[idx].favorite = _onoff;

                    if (_onoff) {
                        MostFavoriteChar = charDataCopy[idx];
                    }


                    PreviewCard(true);
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

        function GetLeague(charidx, lang = 'en') {
            let _container = $('<div>');
            let _select = $('<select>');
            let _selectedIdx = null;
            let _stars = $('<select>');
            for (let idx = 0; idx < league.length; idx++) {
                let _option = $('<option>');
                _option.text(league[idx].league[lang]).val(idx);
                if (charDataCopy[charidx].league == league[idx].image) {
                    _option.attr("selected", "selected");
                    _selectedIdx = idx;
                }
                _select.append(_option);
            }
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
                if (_starsAry.length == 5) {
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
                $(`#leagueimg${charidx}`).attr('src', GetRankImage(charidx));
                let _starsAry = league[parseInt(_selectedIdx)].star;
                if (_starsAry.length == 5) {
                    _stars.show();
                } else {
                    _stars.hide();
                }
                PreviewCard(true);
            });

            _stars.on('change', function (e) {
                let _selectedIdx = $("option:selected", this).val();
                charDataCopy[charidx].star = _selectedIdx;
                $(`#leagueimg${charidx}`).attr('src', GetRankImage(charidx));
                PreviewCard(true);
            });

            _container.append(_select);
            _container.append(_stars);

            return _container;
        }

        function PreviewCard(_isUpdate = false) {
            if (_isUpdate && !IsUserDataUpdate) {
                ToggleBadge($('#BtnExportProfile'), true);
                IsUserDataUpdate = true;
            }
            function leftSide(favchar = null) {
                const cardImage = './img/logo.png';
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

                    if (title.length > 0) {
                        _infoBody.append(_infoTitle);
                    }

                    if (Array.isArray(body)) {
                        body.forEach((_item) => {
                            _x = $('<div>').addClass('m-1');
                            if (_item.length == 0) {
                                _item = '&nbsp;'
                            }
                            _x.html(_item);
                            _infoBody.append(_x);
                        });
                    } else {
                        _infotText.html(body);
                        _infoBody.append(_infotText);
                    }
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
                let _xdiv = $('<div>').addClass(`col-${LeftSideColumn}`).attr({ 'id': 'ProfileCardLeft' });

                let _cardDiv = $('<div>').addClass('card fw-bold m-1 bg-dark').attr({ 'id': 'ProfileCardLeftInner' });
                let _backImg = $('<img>').addClass('card-img m-1');
                let _cardOverlay = $('<div>').addClass('card-img-overlay');
                //
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
                _cardDiv.append(_imageRow);
                _imageRow.css({ height: 240 });
                if (true) {
                    _cdivCss = {};
                    _cdivCss.backgroundRepeat = 'no-repeat';
                    if (MostFavoriteChar != null && MFOn) {
                        let _favCharImg = GetCharImage(MostFavoriteChar, 'profile_');
                        //let _favCharImg = GetCharImage(MostFavoriteChar);
                        let _favCharImgSrc = _favCharImg.attr("src");
                        _cdivCss.backgroundImage = `url("${_favCharImgSrc}")`;
                        _cdivCss.backgroundSize = `50%`;
                        _cdivCss.backgroundPosition = `60% 35%`;

                        let _fakeDiv = $('<div>');
                        _imageRow.append(_fakeDiv);
                        let _fdivCss = {};
                        _fdivCss.backgroundRepeat = 'no-repeat';
                        
                        _fdivCss.backgroundImage = `url("${GetRankImageByData(MostFavoriteChar)}")`;
                        _fdivCss.backgroundSize = `20%`;
                        _fdivCss.backgroundPosition = `20% 100%`;
                        _fakeDiv.css(_fdivCss);
                    } else {
                        _cdivCss.backgroundImage = `url("${cardImage}")`;
                        _cdivCss.backgroundSize = `100%`;
                        _cdivCss.backgroundPosition = `50% 27%`;
                    }
                    _cardDiv.css(_cdivCss);
                } else {
                    _backImg.attr({ 'src': cardImage });
                    //_imageY.append(_backImg);
                    //_imageRow.append(_imageX).append(_imageY).append(_imageZ);
                }
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

                    let _messageDiv = getCard('', _message.split('<>'), 'ProfileComment', false);
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

                    if (charData) {
                        /*
                        let _img = charData.name['en'].toLowerCase() + '.png';
                        if (charData.name.file) {
                            _img = charData.name.file + '.png';
                        }
                        if (!charData.active) {
                            _img = 'random.png';
                        }
                        _charImg.attr({ 'src': `./img/char/${_img}` });
                        */
                        _charImg = GetCharImage(charData).addClass('card-img');
                        if (!charData.active) {
                            //  _cardDiv.removeClass('bg-dark');
                            _charImg.addClass('grayScale');
                            _rankImg.addClass('grayScale');
                        } else if (!charData.favorite) {
                            _charImg.addClass('grayScale');
                            _rankImg.addClass('grayScale');
                            _charImg.addClass(grayBgColor);
                            _rankImg.addClass(grayBgColor);
                        } else {
                            //_rankImg.addClass('bg-dark');
                            _cardDiv.removeClass('bg-dark').addClass('border border-dark');
                        }

                        _rankImg.attr({ 'src': GetRankImage(idx, 'l') });

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
                if (charDataCopy.length % _columnNum == 0) {
                    _sup = 0;
                }
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
                        //_charData = null;
                        let dmy = true;
                    }
                    let _charCardInfo = $('<div>');
                    _charCardInfo = getCharCard(_charData, _loopIdx);
                    _cardGroupDiv.append(_charCardInfo);

                    _loopIdx++
                }

                return _xdiv;
            }

            $('#ProfileCard').remove();
            let _container = $('<div>').attr('id', 'ProfileCard');
            _container.addClass(bsMainContainer);
            _container.css({ width: CardWidth });

            let _leftDiv = leftSide();
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



        function InitInputForm() {
            PlatformArray = platform[0];
            VoiceChatArray = voicechat[0];
            $('.inputInfo').remove();
            SetTextInfo(PlayerName, 'プレイヤー名');
            //setPlatformVC('性別', GenderArray);
            SetTextInfo(FightersId, 'ユーザコード');

            SetTextInfo(PlayTime, 'プレイ時間帯');
            SetTextInfo(ControlerType, 'コントローラ');
            SetPlatformVC('プラットフォーム', PlatformArray);
            SetPlatformVC('ボイスチャット', VoiceChatArray)
            SetTextInfo(MessageText, 'コメント（改行：<>）');
            GetCharData();
        }

        function ToggleBadge(_btn, _onBadge = true) {
            let _positionClass = 'position-relative';
            if (_onBadge) {
                _btn.addClass(_positionClass);
                let _badgeSpan = $('<span>');
                let _dmySpan = $('<span>');
                _badgeSpan.addClass('position-absolute top-0 start-100 translate-middle p-2 bg-danger border border-light rounded-circle');
                _dmySpan.addClass('visually-hidden');
                _dmySpan.text('badge');
                _badgeSpan.append(_dmySpan);
                _btn.append(_badgeSpan);
            } else {
                _btn.removeClass(_positionClass);
                _btn.children('span').remove();
            }
            return _btn;
        }

        function SetButtonEvent() {
            $('#BtnImportProfile').on('click', function (e) {
                ImportParam();
            });

            $('#BtnExportProfile').on('click', function (e) {
                ExportParam();
            });

            $('#BtnParamReset').on('click', function (e) {
                ResetParam();
            });

            $('#BtnExportSample').on('click', function (e) {
                LoadSample();
            });

            $('#claimCharcter').change(function() {
                MFOn = this.checked;
                PreviewCard(true);
            });
        }

        SetButtonEvent();


        AdjustCardSize();
        InitInputForm();
        PreviewCard(false);

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
