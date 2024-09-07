import { handler } from "./hook";


handler({
    Records: [
        // {
        //     Sns: {
        //         Message: 'Test message'
        //     }
        // },
        {
            Sns: {
                Message: 'Test message2'
            }
        }
    ]
} as any)
