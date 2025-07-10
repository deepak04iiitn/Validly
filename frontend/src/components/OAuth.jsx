import React from 'react'
import { AiFillGoogleCircle } from 'react-icons/ai'
import {GoogleAuthProvider, signInWithPopup , getAuth} from 'firebase/auth'
import { app } from '../firebase';
import { useDispatch } from 'react-redux';
import { signInSuccess } from '../redux/user/userSlice';
import { useNavigate } from 'react-router-dom';

export default function OAuth() {

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const auth = getAuth(app);

    const handleGoogleClick = async() => {
        
        const provider = new GoogleAuthProvider();

        provider.setCustomParameters({ prompt : 'select_account'})

        try {

            const resultsFromGoogle = await signInWithPopup(auth , provider);

            const res = await fetch('/backend/auth/google' , {
                method : 'POST',
                headers : { 'Content-Type' : 'application/json' },
                body : JSON.stringify({
                    name : resultsFromGoogle.user.displayName,
                    email : resultsFromGoogle.user.email,
                    googlePhotoUrl : resultsFromGoogle.user.photoURL,
                }),
            })

            const data = await res.json();

            console.log(data)

            if(res.ok)
            {
                dispatch(signInSuccess(data));
                navigate('/');
            }
            
        } catch (error) {
            console.log(error);
        }
    }


  return (
    <button
      type="button"
      onClick={handleGoogleClick}
      className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-pink-500 via-red-400 to-orange-400 text-white font-semibold text-lg shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 outline-none focus:ring-2 focus:ring-pink-400 cursor-pointer"
    >
      <AiFillGoogleCircle className="w-6 h-6 mr-2" />
      Continue with Google
    </button>
  )
}