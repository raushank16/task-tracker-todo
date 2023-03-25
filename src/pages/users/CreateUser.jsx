import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
// import { Link } from 'react-router-dom'
import Toast from '../../components/toast/Toast'

const CreateUser = ({ popup }) => {

  const [message, setMessage] = useState("")
  const [showToast, setShowToast] = useState(false);
  // const navigate = useNavigate();


  const [data, setData] = useState({
    name: '',
    email: '',
    password: '',
    mobile: '',
  })

  const [profileImg, setProfileImg] = useState("")

  const [error, setError] = useState({})


  const handleData = (e) => {
    const newData = { ...data }
    newData[e.target.id] = e.target.value;
    setData(newData)
    console.log(newData);
  }

  const handleImage = (e) => {
    setProfileImg(e.target.files[0])

    console.log(e.target.files[0]);
    // setProfileImg({ profileImg: e.target.files[0] });
  }

  // vallidation
  const validateFrom = () => {
    let err = {};

    if (data.name === '') {
      err.name = 'Name Required'
    } else {
      let nameRegex = /^[a-zA-Z ]{3,30}$/
      if (!nameRegex.test(data.name)) {
        err.name = 'Name Not Valid'
      }
    }

    if (data.email === '') {
      err.email = 'Email Required'
    } else {
      let emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
      if (!emailRegex.test(data.email)) {
        err.email = 'Email Not Valid'
      }
    }

    if (data.password === '') {
      err.password = 'Password Required'

    }
    // else{
    //   let passRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/
    //   if(!passRegex.test(data.password)){
    //     err.password = 'Password must be greater than 8 or a Character and Number'
    //   }
    // }


    if (data.mobile === '') {
      err.mobile = 'Mobile No Required'
    } else {
      let phoneRegex = /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/
      if (!phoneRegex.test(data.mobile)) {
        err.mobile = 'Nobile No Not valid'
      }
    }

    setError({ ...err })
    return Object.keys(err).length > 0 ? false : true
  }

  const handleValidate = () => {
    let isValid = validateFrom()
    isValid && handleSubmit();
  }


  const handleSubmit = (e) => {

    let vals = new FormData();
    vals.append("user", JSON.stringify(data));
    vals.append("profileImg", profileImg);

    console.log(vals, 97)

    // const formData = new FormData();
    // formData.append('image', profileImg);

    axios.post('http://localhost:9000/api/users', vals, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    }
    ).then(res => {
      console.log(res.data);
      console.log(res, 66);
      if (res.status === 200) {

        setMessage("User Created Successfully!");
        setShowToast(true)
        popup(false)
      }
    }).catch(err => {
      // console.log(err);
      setMessage("Server Error : User Not Created!");
      setShowToast(true)
    })
  }



  const handleToastClose = () => {
    setShowToast(false);
  };


  return (

    <>
      <div onClick={() => popup(false)} className='h-full top-0 left-0 w-full absolute opacity-40 z-10 bg-black'></div>

      {showToast && <Toast message={message} onClose={handleToastClose} />}

      <div className='absolute z-20 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 transition-opacity duration-300 shadow-2xl '>
        <div className='bg-slate-50 p-6 rounded-lg flex-row shodow-md shadow-slate-300 min-w-[350px] max-w-[400px] border-2 border-slate-200 '>
          <buton onClick={() => popup(false)} className='flex justify-end shadow-2xl'>

            <div className='cursor-pointer relative pr-3 w-6 h-4'>
              <div className='absolute bg-red-600  w-6 h-1 rotate-45'></div>
              <div className='absolute bg-red-600  w-6 h-1 -rotate-45'></div>
            </div>

          </buton>
          <h2 className='uppercase font-bold text-2xl flex items-center border-b-2 border-b-orange-300 w-fit  mb-6 text-slate-700'>Create User</h2>

          <form>
            <div>
              <input value={data.name} onChange={handleData} type="text" name='' id='name' placeholder='Enter User Name ' className='h-12 w-full rounded-md px-3 bg-transparent shadow-sm border-b-2 border-b-blue-500 rounded-bl-md rounded-br-md focus:border-b-2 focus:border-b-yellow-700 outline-none' />
              <p className='text-red-600 text-sm'>{error.name}</p>

              <input value={data.email} onChange={handleData} type="email" name='' id='email' placeholder='Enter User Email' className='h-12 w-full rounded-md  px-3 bg-transparent shadow-sm mt-4 border-b-2 border-b-blue-500 rounded-bl-md rounded-br-md focus:border-b-2 focus:border-b-yellow-700 outline-none' />
              <p className='text-red-600 text-sm'>{error.email}</p>

              <input value={data.password} onChange={handleData} type="password" name='' id='password' placeholder='Enter User Password' className='h-12 w-full rounded-md px-3 bg-transparent shadow-sm mt-4 border-b-2 border-b-blue-500 rounded-bl-md rounded-br-md focus:border-b-2 focus:border-b-yellow-700 outline-none' />
              <p className='text-red-600 text-sm'>{error.password}</p>

              <input value={data.mobile} onChange={handleData} type="number" name='' id='mobile' placeholder='Enter User Mobile No' className='h-12 w-full rounded-md px-3 bg-transparent shadow-sm mt-4 border-b-2 border-b-blue-500 rounded-bl-md rounded-br-md focus:border-b-2 focus:border-b-yellow-700 outline-none' />
              <p className='text-red-600 text-sm'>{error.mobile}</p>

              <div className='flex flex-col justify-between gap-y-4 mt-4'>
                {/* <input value={profileImg} onChange={handleImage} type="file" name='image' className='text-xs text-grey-500 file:mr-5 file:px-4 file:py-2 file:rounded-full file:border-0 file:text-md file:font-semibold file:text-white file:bg-gradient-to-r file:bg-blue-400 hover:file:cursor-pointer hover:file:opacity-80 ' /> */}

                {/* <input type="file" name='image' onChange={handleImage} className='text-xs text-grey-500 file:mr-5 file:px-4 file:py-2 file:rounded-full file:border-0 file:text-md file:font-semibold file:text-white file:bg-gradient-to-r file:bg-blue-400 hover:file:cursor-pointer hover:file:opacity-80 ' />
                <p className='text-sm'> Please choose your Profile Pic</p> */}
                <input
                  id="profileImg"
                  name="profileImg"
                  placeholder=""
                  type="file"
                  onChange={(event) => {
                    setProfileImg(event.target.files[0])
                  }}
                  required
                // className="hidden"
                />
              </div>

              <button onClick={() => handleValidate()} type='button' className='w-full px-6 py-2 mt-10 m-auto flex items-center justify-center rounded-md bg-gradient-to-r from-cyan-500 to-blue-500 cursor-pointer text-gray-100 font-bold text-xl hover:duration-500 hover:scale-95'>Create</button>



              {/* <Link to='/login'>Login</Link> */}

            </div>


          </form>

        </div>
      </div>
    </>

  )
}

export default CreateUser