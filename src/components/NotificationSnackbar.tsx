import { Alert, Snackbar } from '@mui/material'

interface NotificationSnackbarProps {
    openSnackbar: boolean
    handleCloseSnackbar: VoidFunction
    snackbarMessage: string
    snackbarSeverity: 'error' | 'success'
}

const NotificationSnackbar = ({
    openSnackbar,
    handleCloseSnackbar,
    snackbarMessage,
    snackbarSeverity,
}: NotificationSnackbarProps) => {
    return (
        <div>
            <Snackbar
                open={openSnackbar}
                autoHideDuration={3000}
                onClose={handleCloseSnackbar}
                message={snackbarMessage}
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'center',
                }}
                style={{
                    textAlign: 'center',
                }}
            >
                <Alert
                    onClose={handleCloseSnackbar}
                    severity={snackbarSeverity}
                    sx={{
                        width: 'fit',
                    }}
                >
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </div>
    )
}

export default NotificationSnackbar
