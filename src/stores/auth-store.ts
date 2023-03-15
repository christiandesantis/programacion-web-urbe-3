import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, getAuth, UserCredential, User, updateProfile } from 'firebase/auth'
import { defineStore } from 'pinia'

const auth = getAuth()

export const useAuthStore = defineStore('auth', {
  state: () => ({
    authenticated: false,
    user: {
      uid: null as unknown as string,
      displayName: '',
      email: ''
    }
  }),
  getters: {
    getUser: (state) => state.user
  },
  actions: {
    setAuth (auth: boolean) {
      this.authenticated = auth
    },
    setUser (data: any) {
      this.user.uid = data.uid
      this.user.displayName = data.displayName
      this.user.email = data.email
    },
    clearUser () {
      this.user = {
        uid: null as unknown as string,
        displayName: null as unknown as string,
        email: null as unknown as string
      }
    },
    async register ({ email, password, name, lastname }: {email: string, password: string, name: string, lastname: string}) {
      const response: UserCredential = await createUserWithEmailAndPassword(auth, email, password)
      if (response) {
        this.setUser(response.user)
        updateProfile(auth.currentUser ?? response.user, {
          displayName: `${name} ${lastname}`
        }).then(() => {
          // Profile updated!
          // ...
        }).catch((error) => {
          // An error occurred
          console.log(error)
        })
      } else {
        throw new Error('Unable to register user')
      }
    },
    async logIn ({ email, password }: {email: string, password: string}) {
      const response = await signInWithEmailAndPassword(auth, email, password)
      if (response) {
        this.setUser(response.user)
      } else {
        throw new Error('login failed')
      }
    },
    async logOut () {
      await signOut(auth)
      this.clearUser()
      this.authenticated = false
    },
    async fetchUser (user: User | null) {
      this.setAuth(user !== null)
      if (user) {
        this.setUser({
          uid: user.uid,
          displayName: user.displayName,
          email: user.email
        })
      } else {
        this.clearUser()
      }
    }
  }
})
