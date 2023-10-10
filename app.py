from flask import (
    Flask,
    render_template,
    jsonify,
    request,
    session,
    redirect,
    url_for
)
from pymongo import MongoClient
import jwt
from datetime import datetime, timedelta
import hashlib
import os
import shutil

app = Flask(__name__)

SECRET_KEY = 'persia'

client = MongoClient(
    'mongodb+srv://dapurdenisaa:admin@cluster0.pdztfqq.mongodb.net/?retryWrites=true&w=majority')
db = client.dapurdenisa

TOKEN_KEY = 'mytoken'

# render template
@app.route('/', methods=['GET'])
def home():
    return render_template('index.html')

@app.route('/menu', methods=['GET'])
def menu():
    return render_template('menu.html')

@app.route('/about', methods=['GET'])
def about():
    return render_template('about.html')

@app.route('/contact', methods=['GET'])
def contact():
    return render_template('contact.html')

@app.route('/brownies', methods=['GET'])
def brownies():
    return render_template('menu_brownies.html')

@app.route('/cookies', methods=['GET'])
def cookies():
    return render_template('menu_cookies.html')

@app.route('/testimonial', methods=['GET'])
def testimonial():
    return render_template('testimonial.html')

# admin Only
@app.route('/login', methods=['GET'])
def login():
    token_receive = request.cookies.get(TOKEN_KEY)
    try:
        payload = jwt.decode(
            token_receive,
            SECRET_KEY,
            algorithms=['HS256']
        )
        user_info = db.users.find_one({'username': payload.get('id')})
        return redirect(url_for('dashboard', user_info=user_info))
    except (jwt.ExpiredSignatureError, jwt.exceptions.DecodeError):
        msg = request.args.get('msg')
        return render_template('login.html', msg=msg)


# admin 
@app.route('/adminpanel', methods=["GET"])
def dashboard():
    token_receive = request.cookies.get(TOKEN_KEY)
    try:
        payload = jwt.decode(token_receive, SECRET_KEY, algorithms=["HS256"])
        user_info = db.users.find_one({'username': payload.get('id')})
        return render_template("adminpanel.html", user_info=user_info)
    except jwt.ExpiredSignatureError:
        return redirect(url_for("login", msg="Sesi login kamu telah kadaluwarsa"))
    except jwt.exceptions.DecodeError:
        return redirect(url_for("login", msg="Sepertinya terjadi kesalahan"))

@app.route('/adminmenu', methods=["GET"])
def addmenu():
    token_receive = request.cookies.get(TOKEN_KEY)
    try:
        payload = jwt.decode(token_receive, SECRET_KEY, algorithms=["HS256"])
        user_info = db.users.find_one({'username': payload.get('id')})
        return render_template("adminmenu.html", user_info=user_info)
    except jwt.ExpiredSignatureError:
        return redirect(url_for("login", msg="Sesi login kamu telah kadaluwarsa"))
    except jwt.exceptions.DecodeError:
        return redirect(url_for("login", msg="Sepertinya terjadi kesalahan"))
    
@app.route('/admintesti', methods=["GET"])
def addtesti():
    token_receive = request.cookies.get(TOKEN_KEY)
    try:
        payload = jwt.decode(token_receive, SECRET_KEY, algorithms=["HS256"])
        user_info = db.users.find_one({'username': payload.get('id')})
        return render_template("admintesti.html", user_info=user_info)
    except jwt.ExpiredSignatureError:
        return redirect(url_for("login", msg="Sesi login kamu telah kadaluwarsa"))
    except jwt.exceptions.DecodeError:
        return redirect(url_for("login", msg="Sepertinya terjadi kesalahan"))

@app.route('/adminfaq', methods=["GET"])
def addfaq():
    token_receive = request.cookies.get(TOKEN_KEY)
    try:
        payload = jwt.decode(token_receive, SECRET_KEY, algorithms=["HS256"])
        user_info = db.users.find_one({'username': payload.get('id')})
        return render_template("adminfaq.html", user_info=user_info)
    except jwt.ExpiredSignatureError:
        return redirect(url_for("login", msg="Sesi login kamu telah kadaluwarsa"))
    except jwt.exceptions.DecodeError:
        return redirect(url_for("login", msg="Sepertinya terjadi kesalahan"))


# posting menu
@app.route('/adminmenu/postingmenu', methods=['POST'])
def postingmenu():
    token_receive = request.cookies.get(TOKEN_KEY)
    try:
        payload = jwt.decode(
            token_receive,
            SECRET_KEY,
            algorithms=['HS256']
        )
        user_info = db.users.find_one({'username': payload.get('id')})

        # buat kode input data disini
        title_receive = request.form.get('title_give')
        file = request.files['file_give']
        category_receive = request.form.get('category_give')
        price_receive = request.form.get('price_give') 

        # Validasi jenis layout
        if not category_receive:
            return jsonify({'msg': 'Mohon pilih jenis layout'}), 400    
        
        # Mencari nomor folder terakhir
        last_folder = db.product.find_one(
            sort=[('folder', -1)], projection={'folder': 1})
        if last_folder and 'folder' in last_folder:
            last_number = int(last_folder['folder'].replace('detail-', ''))
            detail = f"detail-{last_number + 1}"
        else:
            detail = "detail-1"

        directory = f'static/img/{detail}'
        os.makedirs(directory, exist_ok=True)

        # akhir kode cari folder
        extension = file.filename.split('.')[1]
        filename = f'{directory}/{title_receive}.{extension}'
        file.save(filename)

        DBfile = f'img/{detail}/{title_receive}.{extension}'

        count = db.product.count_documents({})
        num = count + 1

        doc = {
            'num': num,
            'username': user_info.get('username'),
            'title': title_receive,
            'file': DBfile,
            'folder': detail,
            'category':category_receive,
            'price':price_receive,  
        }
        db.product.insert_one(doc)
        return jsonify({'msg': 'data telah ditambahkan', 'result': 'success'})
    except (jwt.ExpiredSignatureError, jwt.exceptions.DecodeError):
        return redirect(url_for('addmenu'))
    
 # delet posting
@app.route('/adminmenu/delete-menu', methods=['POST'])
def delete_menu():
    num_receive = request.form['num_give']

    # Temukan post yang akan dihapus
    post = db.product.find_one({'num': int(num_receive)})

    if post:
        # Hapus folder terkait beserta isinya
        folder_to_delete = post['folder']
        folder_path = os.path.join('static', 'img', folder_to_delete)

        if os.path.exists(folder_path):
            shutil.rmtree(folder_path)  # Hapus folder dan isinya

        # Hapus post dari database
        db.product.delete_one({'num': int(num_receive)})
        db.product_detail.delete_many({'folder': post.get('folder')})
        return jsonify({'msg': 'hapus berhasil!'})
    else:
        return jsonify({'msg': 'post tidak ditemukan'})
    

@app.route('/get-posts', methods=['GET'])
def get_posts():
    card = list(db.product.find({}, {'_id': False}))
    return jsonify({'card': card})

    # jika ingin menampilkan category masing masing harus isi di bagian samping id

# login save
@app.route('/login_save', methods=['POST'])
def login_save():
    username_receive = request.form['username_give']
    password_receive = request.form['password_give']
    pw_hash = hashlib.sha256(password_receive.encode('utf-8')).hexdigest()
    result = db.users.find_one({
        'username': username_receive,
        'password': pw_hash
    })
    if result:
        payload = {
            'id': username_receive,
            "exp": datetime.utcnow() + timedelta(seconds=60 * 60 * 1),
        }
        token = jwt.encode(payload, SECRET_KEY, algorithm="HS256")
        return jsonify({'result': 'success', 'token': token})
    else:
        return jsonify({
            "result": "fail",
            "msg": "Kami tidak dapat menemukan pengguna dengan kombinasi id/kata sandi tersebut",
        })


# faq 
@app.route('/adminfaq/postingfaq', methods=['POST'])
def postingfaq():
    token_receive = request.cookies.get(TOKEN_KEY)
    try:
        payload = jwt.decode(
            token_receive,
            SECRET_KEY,
            algorithms=['HS256']
        )
        user_info = db.users.find_one({'username': payload.get('id')})

        # buat kode input data disini
        titlefaq_receive = request.form.get('titlefaq_give')
        descriptionfaq_receive = request.form.get('descriptionfaq_give') 

        count = db.faq.count_documents({})
        num = count + 1

        doc = {
            'num': num,
            'username': user_info.get('username'),
            'title': titlefaq_receive,
            'description':descriptionfaq_receive,
        }
        db.faq.insert_one(doc)
        return jsonify({'msg': 'data telah ditambahkan', 'result': 'success'})
    except (jwt.ExpiredSignatureError, jwt.exceptions.DecodeError):
        return redirect(url_for('addmenu'))

# get post faq
@app.route('/get-faqs', methods=['GET'])
def get_faqs():
    card = list(db.faq.find({}, {'_id': False}))
    return jsonify({'card': card})

# delete faq
@app.route('/adminfaq/delete-faq', methods=['POST'])
def delete_faq():
    num_receive = request.form['num_give']

    # Temukan post yang akan dihapus
    post = db.faq.find_one({'num': int(num_receive)})

    if post:
        # Hapus post dari database
        db.faq.delete_one({'num': int(num_receive)})
        db.faq_detail.delete_many({'folder': post.get('folder')})
        return jsonify({'msg': 'hapus berhasil!'})
    else:
        return jsonify({'msg': 'post tidak ditemukan'})


@app.route('/adminmenu/get-posting/<int:num>', methods=['GET'])
def get_posting(num):
    token_receive = request.cookies.get(TOKEN_KEY)
    try:
        payload = jwt.decode(
            token_receive,
            SECRET_KEY,
            algorithms=['HS256']
        )

        post = db.product.find_one({'num': num}, {'_id': False})

        if postingmenu:
            return jsonify({'result': 'success', 'post': post})
        else:
            return jsonify({'result': 'error', 'msg': 'Posting tidak ditemukan'}), 404

    except (jwt.ExpiredSignatureError, jwt.exceptions.DecodeError):
        return redirect(url_for('home'))
    

@app.route('/adminmenu/update-posting/<int:num>', methods=['POST'])
def update_posting(num):
    token_receive = request.cookies.get(TOKEN_KEY)
    try:
        payload = jwt.decode(
            token_receive,
            SECRET_KEY,
            algorithms=['HS256']
        )

        title = request.form.get('title')
        layout = request.form.get('layout')
        price = request.form.get('price')

        if "file_give" in request.files:
            new_image = request.files['file_give']

            old_post = db.product.find_one({'num': num})
            old_image_path = old_post.get('file')

            if new_image:
                # Lakukan penyimpanan file gambar yang baru
                extension = new_image.filename.split(
                    '.')[-1]  # Ambil ekstensi dengan benar
                filename = f'static/img/detail-{num}/{title}.{extension}'
                new_image.save(filename)

                new_image_path = f'img/detail-{num}/{title}.{extension}'
                db.product.update_one({'num': num}, {
                                      '$set': {'title': title, 'layout': layout, 'file': new_image_path}})

                # Hapus gambar yang lama
                if old_image_path:
                    old_image_file = os.path.join('static', old_image_path)
                    if os.path.exists(old_image_file):
                        os.remove(old_image_file)

        else:
            # Jika tidak ada file yang diunggah, tetap perbarui title dan layout
            db.product.update_one(
                {'num': num}, {'$set': {'title': title, 'layout': layout, 'price': price,}})

        return jsonify({'result': 'success', 'msg': 'Data telah diperbarui'})

    except (jwt.ExpiredSignatureError, jwt.exceptions.DecodeError):
        return redirect(url_for('home'))
    




if __name__ == "__main__":
    app.run("0.0.0.0", port=5000, debug=True)