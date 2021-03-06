import { HttpResponse, HttpRequest, Controller, Emailvalidator } from '../protocols'
import { MissingParamError, InvalidParamError } from '../errors' 
import { badRequest, serverError } from '../helpers/http-helper'

export class SignUpController implements Controller {
  private readonly emailValidator: Emailvalidator

  constructor (emailValidator: Emailvalidator) {
    this.emailValidator = emailValidator
  }

  handle (httpRequest: HttpRequest): HttpResponse {
    try {
      const requiredFields = ['name', 'email', 'password', 'passwordConfirmation']
      for (const field of requiredFields) {
        if (!httpRequest.body[field]){
          return badRequest(new MissingParamError(field))
        }
      }
      const isValid = this.emailValidator.isValid(httpRequest.body.email);
      if (!isValid) {
        return badRequest(new InvalidParamError('email'))  
      }  
    } catch (error) {
      return serverError()
    }
     
  }
}
