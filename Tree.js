const trees = [];

const registerTree = function (tag, dataurl) {

    var sc = document.getElementsByTagName("script");
    var src;
    for (i = 0; i < sc.length; i++) {
        if (sc[i].src.match(/Tree\.js$/)) {
            src = sc[i].src.replace("Tree.js", "");
            break;
        }
    }

    var link = document.createElement("link");
    link.rel = "stylesheet";
    link.type = "text/css";
    link.href = src + "Tree.css";
    link.media = "all";
    document.getElementsByTagName("head")[0].appendChild(link);
    
    //Member variable                
    var data;
    var preSelect;
    var icons = [];

    //Events
    //Every event pops before executed
    //If you return false, process doesn't executed
    
    var onClick = function () { }; //obj
    this.setOnClick = function (gridEvent) {
        onClick = gridEvent;
    };

    var onDblClick = function () { }; //obj
    this.setOnDblClick = function (gridEvent) {
        onDblClick = gridEvent;
    };
    
    //ToolScript
    this.reload = function () {
        data = undefined;
        gridAjax(null, datacallback, dataurl);
    };

    this.getValue = function (id) {
        return document.getElementById(tag + "_" + id).data;
    };

    this.setIcon = function (tag, url) {
        var item = {};
        item.tag = tag;
        item.url = url;
        icons.push(item);
    };

    var loadTree = function () {        
        
        console.log(data.tree);
        var ulRoot = document.createElement("ul");
        ulRoot.setAttribute("id", tag + "_tree");
        ulRoot.classList.add("tree");
        var li;
        for (i in data.tree) {            
            li = document.createElement("li"); 
            li.data = data.tree[i];
            li.setAttribute("id", tag + "_" + data.tree[i].id);
            data.tree[i].element = li;
            setChild(li, data.tree[i]);
            ulRoot.appendChild(li);
        }

        var nodes = document.getElementById(tag);
        while (nodes.firstChild) {
            nodes.removeChild(nodes.firstChild);
        }
        document.getElementById(tag).appendChild(ulRoot);
    };

    var setChild = function (element, obj) {
            
        var span = document.createElement("span");
        span.classList.add("item");        
        span.innerHTML = obj.Name;
        span.addEventListener("click", function () {

            onClick(obj);

            if (preSelect !== undefined) {
                preSelect.classList.remove("selected");                
            }

            preSelect = this;
            this.classList.add("selected");
            
        });
        span.addEventListener("dblclick", function () {
            onDblClick(obj);
        });

        for (var i = 0; i < icons.length; i++) {
            if (icons[i].tag === obj.Type) {                
                var icon = document.createElement("img");
                icon.setAttribute("src", icons[i].url);
                span.prepend(icon);
            }
        }

        element.appendChild(span);
        
        if (obj.child !== undefined) {
            var img = document.createElement("img");
            img.setAttribute("src", "/Tree/Images/expand.png");
            img.addEventListener("click", function () {
                this.parentElement.querySelector(".nested").classList.toggle("active");
                
                if (this.getAttribute("src") === "/Tree/Images/expand.png")
                    this.setAttribute("src", "/Tree/Images/nested.png");
                else
                    this.setAttribute("src", "/Tree/Images/expand.png");
            });
            
            element.appendChild(img);
            var ul = document.createElement("ul");
            ul.classList.add("nested");
            var li;
            for (i in obj.child) {
                li = document.createElement("li");
                li.data = obj.child[i];
                obj.child[i].element = li;
                li.setAttribute("id", tag + "_" + obj.child[i].id);
                setChild(li, obj.child[i]);
                ul.appendChild(li);
            }
            element.appendChild(ul);
        }
    };
    
    var dataCallBack = function (obj) {                      
        data = obj;                
        loadTree();
    };

    //Working part
    trees[tag] = this;    
    return treeAjax(null, dataCallBack, dataurl);
};

const treeAjax = function (obj, callback, url) {    
    if (url === undefined) url = "/Form/Common/AjaxAuto.aspx";
    var xhr = new XMLHttpRequest();
    xhr.open('POST', url, true);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.onload = function () {
        if (xhr.status === 200) {
            var obj;
            try {
                obj = JSON.parse(xhr.responseText);                
            } catch (error) {                
                obj = xhr.responseText;
            }
            callback(obj);
        }
        else {
            alert("Ajax Request Error. Status " + xhr.status);
        }
        return xhr.status;
    };
    xhr.send(encodeURI(treeParam(obj)));
};

const treeParam = function (object) {
    var encodedString = '';
    for (var prop in object) {
        if (object.hasOwnProperty(prop)) {
            if (encodedString.length > 0) {
                encodedString += '&';
            }
            encodedString += encodeURI(prop + '=' + object[prop]);
        }
    }
    return encodedString;
};

const setTree = function (tag, dataurl, uploadurl) {
    return registerTree(tag, dataurl, uploadurl);
};