// import NextAuth, { NextAuthOptions } from "next-auth";
// import CredentialsProvider from "next-auth/providers/credentials";
// import { AppDataSource } from "@/lib/db/data-source";
// import { User } from "@/lib/db/entities/User";
// import bcrypt from "bcryptjs";

// export const authOptions: NextAuthOptions = {
//   providers: [
//     CredentialsProvider({
//       name: "Credentials",
//       credentials: {
//         email: { label: "Email", type: "email" },
//         password: { label: "Password", type: "password" },
//       },
//       async authorize(credentials) {
//         try {
//           if (!credentials?.email || !credentials?.password) {
//             console.warn("Missing email or password in credentials");
//             return null;
//           }

//           const db = await AppDataSource();
//           const userRepo = db.getRepository(User);

//           // IMPORTANT: explicitly select passwordHash (because select: false hides it)
//           const user = await userRepo.findOne({
//             where: { email: credentials.email as string },
//             select: ["id", "email", "role", "passwordHash"],
//           });

//           if (!user) {
//             console.warn(`No user found for email: ${credentials.email}`);
//             return null;
//           }

//           if (!user.passwordHash) {
//             console.warn(`User ${credentials.email} has no password hash`);
//             return null;
//           }

//           const isValid = await bcrypt.compare(
//             credentials.password as string,
//             user.passwordHash
//           );

//           if (!isValid) {
//             console.warn(`Invalid password for ${credentials.email}`);
//             return null;
//           }

//           console.log(`Successful login for ${credentials.email}`);

//           // Optional: update last login time
//           user.lastLogin = new Date();
//           await userRepo.save(user).catch(err => {
//             console.error("Failed to update lastLogin:", err);
//           });

//           return {
//             id: user.id,
//             email: user.email,
//             role: user.role,
//           };
//         } catch (error) {
//           console.error("Authorize error:", error);
//           return null;
//         }
//       },
//     }),
//   ],
//   callbacks: {
//     async jwt({ token, user }) {
//       if (user) {
//         token.role = user.role;
//         token.id = user.id;
//       }
//       return token;
//     },
//     async session({ session, token }) {
//       if (token && session.user) {
//         session.user.role = token.role;
//         session.user.id = token.id;
//       }
//       return session;
//     },
//   },
//   pages: {
//     signIn: "/login",
//   },
//   session: {
//     strategy: "jwt",
//   },
//   // Optional: enable debug in development
//   debug: process.env.NODE_ENV === "development",
// };

// const handler = NextAuth(authOptions);

// export { handler as GET, handler as POST };


// sarbajit's code 

import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { AppDataSource } from "@/lib/db/data-source";
import { User } from "@/lib/db/entities/User";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        isAdmin: { label: "Is Admin", type: "text", optional: "true" }, // hidden field
      },
      async authorize(credentials) {
        console.log("Authorize call with email:", credentials?.email);
        if (!credentials?.email || !credentials?.password) {
          console.log("Missing email or password");
          throw new Error("Missing email or password");
        }

        const db = await AppDataSource();
        const userRepo = db.getRepository(User);

        const user = await userRepo.findOne({
          where: { email: credentials.email },
        });

        console.log("User found in DB:", !!user);
        if (user) {
          console.log("User has password field:", !!user.password);
          console.log("User role:", user.role);
        }

        if (!user || !user.password) {
          console.log("Authentication failed: User not found or password missing");
          throw new Error("Invalid credentials");
        }

        const isValid = await bcrypt.compare(credentials.password, user.password);


        if (!isValid) {
          console.log("Password comparison result: false");
          throw new Error("Invalid credentials");
        }

        // If logging in from admin portal, strictly enforce admin role
        if (credentials?.isAdmin === "true" && user.role !== "admin") {
          throw new Error("Access denied: Admin privileges required");
        }

        return {
          id: user.id,
          email: user.email,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as { role?: string }).role;
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        (session.user as { role?: string }).role = token.role as string;
        (session.user as { id?: string }).id = token.id as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
